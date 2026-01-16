import asyncio
import os
import sys
import time
import subprocess
from playwright.async_api import async_playwright

async def capture_evidence():
    print("📸 Starting Vibe Check Documentation...")
    
    # 1. Start Vite Server
    print("🚀 Launching Vite Server...")
    process = subprocess.Popen(
        ["npm", "run", "dev", "--", "--port", "5174"], 
        stdout=subprocess.PIPE, 
        stderr=subprocess.PIPE,
        preexec_fn=os.setsid # Create new process group
    )
    
    # Wait for server to start
    time.sleep(5) 
    
    screenshot_path = "_artifacts/vibe_check.png"
    
    try:
        async with async_playwright() as p:
            # 2. Launch Browser
            browser = await p.chromium.launch()
            page = await browser.new_page(viewport={"width": 1280, "height": 832})
            
            # 3. Navigate & Wait
            print("🌐 Navigating to localhost:5174...")
            await page.goto("http://localhost:5174")
            await page.wait_for_load_state("networkidle")
            
            # 4. Capture Screenshot
            print(f"🖼️ Capturing screenshot to {screenshot_path}...")
            await page.screenshot(path=screenshot_path, full_page=True)
            
            await browser.close()
            print("✅ Capture complete.")
            
    except Exception as e:
        print(f"❌ Error during capture: {e}")
    finally:
        # 5. Cleanup Server
        print("🛑 Strings server...")
        os.killpg(os.getpgid(process.pid), 15) # Kill process group
        print("👋 Done.")

if __name__ == "__main__":
    asyncio.run(capture_evidence())
