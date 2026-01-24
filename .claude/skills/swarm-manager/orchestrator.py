import os
import sys
import glob
import asyncio
import argparse
import json
from typing import List, Dict
from anthropic import AsyncAnthropic
from tqdm.asyncio import tqdm
from rich.console import Console
from rich.panel import Panel

console = Console()

# --- Configuration ---
MAX_CONCURRENCY = 5  # Safety limit for rate limits
MODEL_NAME = "claude-3-5-sonnet-20241022" # Using Sonnet for speed/cost balance in Swarm

async def get_files(instruction: str, client: AsyncAnthropic) -> List[str]:
    """
    Asks the Planner LLM to decide which files to touch based on the instruction.
    """
    console.print(f"[bold cyan]🔍 Analyzer Agent:[/bold cyan] Scanning project for relevant files...")
    
    # Simple heuristic: scan structure (limited depth)
    file_list = []
    for root, dirs, files in os.walk("."):
        if "node_modules" in dirs: dirs.remove("node_modules")
        if ".git" in dirs: dirs.remove(".git")
        if "_artifacts" in dirs: dirs.remove("_artifacts")
        for file in files:
            if file.endswith(('.js', '.jsx', '.ts', '.tsx', '.css', '.py', '.md')):
                file_list.append(os.path.join(root, file))
    
    context_list = "\n".join(file_list[:200]) # context window limit protection

    prompt = f"""
    Current Project Structure:
    {context_list}

    User Instruction: "{instruction}"

    Task: Identify exactly which files from the list above need to be modified or read to accomplish the instruction.
    Return ONLY a raw JSON list of strings. Example: ["src/App.jsx", "src/components/Button.jsx"]
    If the instruction implies all files of a type (e.g. "refactor all jsx"), list them all.
    """

    response = await client.messages.create(
        model=MODEL_NAME,
        max_tokens=4096,
        messages=[{"role": "user", "content": prompt}]
    )
    
    try:
        content = response.content[0].text
        # Naive json extraction
        start = content.find('[')
        end = content.rfind(']') + 1
        json_str = content[start:end]
        target_files = json.loads(json_str)
        return target_files
    except Exception as e:
        console.print(f"[red]Failed to parse planner plan:[/red] {e}")
        return []

async def worker_task(file_path: str, instruction: str, client: AsyncAnthropic, semaphore: asyncio.Semaphore):
    """
    The Worker Agent: Reads a file, applies changes, returns new content.
    """
    async with semaphore:
        try:
            if not os.path.exists(file_path):
                return None
            
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()

            prompt = f"""
            You are a Swarm Worker Agent.
            
            Target File: {file_path}
            
            Instruction: {instruction}
            
            Rule: 
            1. Output the COMPLETE updated content of the file. 
            2. Do NOT use markdown code blocks. Just the raw code.
            3. If no changes are needed, return the string "NO_CHANGE".
            
            Current Content:
            {content}
            """

            response = await client.messages.create(
                model=MODEL_NAME,
                max_tokens=8192,
                messages=[{"role": "user", "content": prompt}]
            )
            
            new_content = response.content[0].text
            if "NO_CHANGE" in new_content:
                return None
                
            return (file_path, new_content)

        except Exception as e:
            console.print(f"[red]Error processing {file_path}:[/red] {e}")
            return None

async def main():
    parser = argparse.ArgumentParser(description="AntiGravity Swarm Orchestrator")
    parser.add_argument("instruction", help="The mission for the swarm")
    parser.add_argument("--key", help="Anthropic API Key", default=os.environ.get("ANTHROPIC_API_KEY"))
    args = parser.parse_args()

    if not args.key:
        console.print("[bold red]❌ Error: No API Key found.[/bold red]")
        console.print("Please set ANTHROPIC_API_KEY environment variable or pass --key.")
        sys.exit(1)

    client = AsyncAnthropic(api_key=args.key)
    
    # 1. Plan
    target_files = await get_files(args.instruction, client)
    
    if not target_files:
        console.print("[yellow]No relevant files found by Planner.[/yellow]")
        return

    console.print(Panel(f"[bold green]Swarm Plan[/bold green]\n\nTarget Files ({len(target_files)}):\n" + "\n".join(target_files)))
    
    # In a real CLI, we might ask for confirmation here, but for now we proceed.
    
    # 2. Execute
    console.print(f"[bold cyan]🚀 Launching {len(target_files)} Drones...[/bold cyan]")
    semaphore = asyncio.Semaphore(MAX_CONCURRENCY)
    
    tasks = [worker_task(f, args.instruction, client, semaphore) for f in target_files]
    results = []
    
    for f in tqdm.as_completed(tasks, total=len(tasks), desc="Processing"):
        res = await f
        if res:
            results.append(res)
            
    # 3. Apply
    console.print(f"[bold cyan]💾 Applying changes to {len(results)} files...[/bold cyan]")
    for file_path, new_content in results:
        # Strip markdown if accidental
        if new_content.startswith("```"):
            lines = new_content.splitlines()
            if lines[0].startswith("```"): lines = lines[1:]
            if lines[-1].startswith("```"): lines = lines[:-1]
            new_content = "\n".join(lines)
            
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
            
    console.print("[bold green]✅ Swarm Mission Complete.[/bold green]")

if __name__ == "__main__":
    asyncio.run(main())
