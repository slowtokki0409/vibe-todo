#!/usr/bin/env python3
"""
QA Engineer v2.1 - Advanced Implementation with Tool Use
Features: Prompt Caching, Tool Use (100% JSON), Sub-agents (Haiku + Opus)
"""

import json
import os
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional

# Anthropic SDK
try:
    import anthropic
except ImportError:
    print("❌ Anthropic SDK not installed. Run: pip3 install anthropic")
    exit(1)

# Import tool definitions
from tools import create_scorecard_tool


class QAEngineerV2:
    """Advanced QA Engineer with caching, JSON mode, and sub-agents."""
    
    def __init__(self, project_root: str = "."):
        self.project_root = Path(project_root)
        self.client = anthropic.Anthropic()
        
        # Models
        self.haiku_model = "claude-3-haiku-20250122"
        self.opus_model = "claude-opus-4-20250514"
        
        # Thresholds
        self.confidence_threshold = 70
        
        # Paths
        self.artifacts_dir = self.project_root / "_artifacts"
        self.artifacts_dir.mkdir(exist_ok=True)
    
    def load_context(self) -> str:
        """Load cacheable context from project files."""
        context_parts = []
        
        # 1. ANTIGRAVITY.md
        antigravity_path = self.project_root / "ANTIGRAVITY.md"
        if antigravity_path.exists():
            context_parts.append(f"# Project Context\n{antigravity_path.read_text()}")
        
        # 2. Scorecard.md
        scorecard_path = self.project_root / ".claude" / "Scorecard.md"
        if scorecard_path.exists():
            context_parts.append(f"# Quality Standards\n{scorecard_path.read_text()}")
        
        # 3. CLAUDE.md (global)
        claude_md_path = Path.home() / ".claude" / "CLAUDE.md"
        if claude_md_path.exists():
            context_parts.append(f"# Personal Coding Standards\n{claude_md_path.read_text()}")
        
        # 4. SKILL.md
        skill_path = self.project_root / ".claude" / "skills" / "qa-engineer-v2" / "SKILL.md"
        if skill_path.exists():
            context_parts.append(f"# QA Instructions\n{skill_path.read_text()}")
        
        return "\n\n---\n\n".join(context_parts)
    
    def haiku_scan(self, code: str) -> List[Dict]:
        """Fast initial scan with Haiku - v2.1 with enhanced prompting."""
        print("🔍 Step 1: Haiku scanning (v2.1)...")
        
        # Enhanced role definition from Prompt Engineering Tutorial
        role_definition = """You are a senior code scanner with expertise in:
- Modern web development (React, Vue, TypeScript, vanilla JS)
- Security best practices (OWASP, XSS, CSRF prevention)
- Performance optimization (Core Web Vitals, 60fps)
- Accessibility standards (WCAG 2.1 AA)

Your scans are thorough, evidence-based, and confidence-scored."""

        # Few-shot examples
        examples = """
<example type="critical">
{
  "category": "code_quality",
  "severity": "critical",
  "confidence": 95,
  "description": "Missing try-catch for localStorage",
  "evidence": "Line 42: localStorage.setItem(...) without error handling"
}
</example>

<example type="recommended">
{
  "category": "code_quality",
  "severity": "recommended",
  "confidence": 75,
  "description": "Large component function",
  "evidence": "App component spans 260+ lines (lines 39-301)"
}
</example>
"""

        # Main prompt with XML data separation
        prompt = f"""{role_definition}

Your task: Scan the code below for ALL potential issues.

<code>
{code}
</code>

{examples}

Scan systematically step by step:

Step 1: Error Handling
- Check for try-catch blocks around risky operations
- Verify input validation before processing
- Look for error message handling

Step 2: Code Structure  
- Identify functions >50 lines
- Check for code duplication (DRY violations)
- Verify separation of concerns

Step 3: Best Practices
- Security vulnerabilities (XSS, injection)
- Type safety patterns
- Clean console (no errors/warnings)

Step 4: UI/UX (if applicable)
- Color palette quality
- Micro-animations presence
- Responsive design

Step 5: Performance
- Memory leaks (event listener cleanup)
- Efficient rendering
- Bundle size considerations

For each issue found:
- Quote EXACT evidence (line numbers + code snippet)
- Assign HONEST confidence (60-100)
  - 90-100: Objective, verifiable
  - 80-89: Clear violation with strong evidence
  - 70-79: Solid concern with reasonable evidence
  - 60-69: Subjective improvement (will be filtered)
- Choose severity (critical/important/recommended/suggestion)

CRITICAL: Avoid hallucinations
- Only report issues you can QUOTE from the code
- If unsure, lower confidence (<70 = will be filtered out)
- Never generalize or assume
- Cite exact line numbers or mark as ERROR

Return ONLY a valid JSON array:
[
  {{
    "category": "code_quality",
    "severity": "critical",
    "confidence": 95,
    "description": "Missing input validation",
    "evidence": "Line 42: no checks before submission"
  }}
]

Let's proceed systematically."""

        response = self.client.messages.create(
            model=self.haiku_model,
            max_tokens=2048,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        
        try:
            issues = json.loads(response.content[0].text)
            print(f"✅ Haiku found {len(issues)} potential issues")
            return issues
        except json.JSONDecodeError:
            print("⚠️  Haiku response was not valid JSON, extracting...")
            # Fallback: try to extract JSON from markdown
            text = response.content[0].text
            if "```json" in text:
                json_str = text.split("```json")[1].split("```")[0].strip()
                issues = json.loads(json_str)
                print(f"✅ Extracted {len(issues)} issues from markdown")
                return issues
            else:
                print("❌ Could not parse Haiku response")
                return []
    
    def filter_high_confidence(self, issues: List[Dict]) -> List[Dict]:
        """Filter issues by confidence threshold."""
        print(f"\n🔧 Step 2: Filtering (threshold: {self.confidence_threshold})...")
        
        high_confidence = [
            issue for issue in issues
            if issue.get('confidence', 0) >= self.confidence_threshold
        ]
        
        print(f"✅ Filtered to {len(high_confidence)} high-confidence issues " 
              f"({len(issues) - len(high_confidence)} filtered out)")
        
        return high_confidence
    
    def opus_evaluate(self, code: str, filtered_issues: List[Dict], system_context: str) -> Dict:
        """Deep evaluation with Opus using Tool Use - v2.1 (100% JSON guarantee)."""
        print(f"\n🎯 Step 3: Opus evaluation with Tool Use (v2.1)...")
        
        # Enhanced role
        role = """You are a senior QA engineer with 10+ years of experience specializing in:
- Modern web applications (React, Vue, vanilla JS)
- Security auditing (OWASP Top 10)
- Performance optimization (Core Web Vitals)
- Accessibility compliance (WCAG 2.1)

Your evaluations are evidence-based, confidence-scored, and actionable."""

        # Main prompt with XML separation
        prompt = f"""{role}

Your task: Generate a complete Scorecard by evaluating the filtered issues.

<context>
{system_context}
</context>

<code>
{code}
</code>

<filtered_issues>
{json.dumps(filtered_issues, indent=2)}
</filtered_issues>

Evaluate step by step:

Step 1: Verify Issues
- Confirm each issue exists in <code>
- Re-check evidence (line numbers match code)
- Remove any hallucinated issues

Step 2: Assign Final Confidence
- Critical severity → confidence ≥90 required
- Important severity → confidence ≥80 required
- Recommended → confidence ≥70 required
- If confidence drops below threshold, lower severity or remove

Step 3: Calculate Deductions
- Critical: -3 to -8 points
- Important: -2 to -5 points
- Recommended: -1 to -3 points

Step 4: Generate Category Scores
- Code Quality: Start at 25, subtract deductions
- UI/UX: Start at 25, subtract deductions
- Functionality: Start at 25, subtract deductions
- Performance: Start at 25, subtract deductions

Step 5: Calculate Overall
- Total = Sum of 4 categories (max 100)
- Grade Scale:
  - S+: 95-100
  - S: 90-94
  - A: 85-89
  - B: 75-84
  - C: 60-74
  - F: <60

Step 6: Overall Confidence
- Weighted average of all issue confidences
- Round to nearest integer

Step 7: Call the generate_qa_scorecard tool
- Use the tool to return your evaluation in the required JSON format
- Include timestamp in ISO 8601 format
- Ensure all required fields are present

Let's proceed systematically and generate the scorecard."""

        # Get scorecard tool definition
        scorecard_tool = create_scorecard_tool()

        # Make request with FORCED tool use
        response = self.client.messages.create(
            model=self.opus_model,
            max_tokens=4096,
            tools=[scorecard_tool],
            tool_choice={"type": "tool", "name": "generate_qa_scorecard"},  # Force tool!
            system=[
                {
                    "type": "text",
                    "text": system_context,
                    "cache_control": {"type": "ephemeral"}  # Cache!
                }
            ],
            messages=[{"role": "user", "content": prompt}]
        )
        
        # Extract scorecard from tool use (guaranteed valid JSON!)
        try:
            tool_use_block = next(block for block in response.content if block.type == "tool_use")
            scorecard = tool_use_block.input  # Already parsed, schema-validated JSON!
            
            print(f"✅ Opus evaluation complete (Tool Use)")
            print(f"   Score: {scorecard.get('overall_score', '?')}/100")
            print(f"   Grade: {scorecard.get('grade', '?')}")
            print(f"   Confidence: {scorecard.get('overall_confidence', '?')}%")
            print(f"   🎉 JSON validated by schema!")
            
            return scorecard
        except StopIteration:
            print("❌ No tool_use block in response")
            print(f"Response: {response.content}")
            return {"error": "No tool use in response"}
        except Exception as e:
            print(f"❌ Tool use extraction failed: {e}")
            return {"error": str(e)}
    
    def save_reports(self, scorecard: Dict) -> tuple[str, str]:
        """Save JSON and Markdown reports."""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        # JSON report
        json_path = self.artifacts_dir / f"Scorecard_Report_{timestamp}.json"
        with open(json_path, 'w') as f:
            json.dump(scorecard, f, indent=2)
        
        # Markdown report
        md_path = self.artifacts_dir / f"Scorecard_Report_{timestamp}.md"
        markdown = self.generate_markdown_report(scorecard)
        md_path.write_text(markdown)
        
        print(f"\n📄 Reports saved:")
        print(f"   JSON: {json_path}")
        print(f"   Markdown: {md_path}")
        
        return str(json_path), str(md_path)
    
    def generate_markdown_report(self, scorecard: Dict) -> str:
        """Generate Markdown report from JSON scorecard."""
        timestamp = scorecard.get('timestamp', datetime.now().isoformat())
        score = scorecard.get('overall_score', 0)
        confidence = scorecard.get('overall_confidence', 0)
        grade = scorecard.get('grade', '?')
        
        md = f"""# QA Evaluation Report

**Date**: {timestamp}
**Overall Score**: {score}/100 ({grade} Grade)
**Overall Confidence**: {confidence}%

---

## Priority Action Items

"""
        
        # Priority actions
        for action in scorecard.get('priority_actions', []):
            severity_emoji = {"critical": "🔴", "important": "🟡", "recommended": "🟢"}.get(action.get('severity', ''), '⚪')
            md += f"{severity_emoji} **{action.get('issue', 'Unknown')}** " \
                  f"(Confidence: {action.get('confidence', 0)}%)\n"
        
        md += "\n---\n\n## Categories\n\n"
        
        # Categories
        for category_name, category_data in scorecard.get('categories', {}).items():
            cat_score = category_data.get('score', 0)
            cat_conf = category_data.get('confidence', 0)
            
            md += f"### {category_name.replace('_', ' ').title()} [{cat_score}/25] [Confidence: {cat_conf}%]\n\n"
            
            for issue in category_data.get('issues', []):
                severity_emoji = {
                    "critical": "🔴",
                    "important": "🟡",
                    "recommended": "🟢",
                    "suggestion": "⚪"
                }.get(issue.get('severity', ''), '⚪')
                
                md += f"{severity_emoji} **{issue.get('description', 'Unknown')}** " \
                      f"[Confidence: {issue.get('confidence', 0)}] ({issue.get('deduction', 0)} points)\n"
                if issue.get('evidence'):
                    md += f"   - Evidence: {issue['evidence']}\n"
                if issue.get('fix'):
                    md += f"   - Fix: {issue['fix']}\n"
                md += "\n"
        
        return md
    
    def evaluate(self, code: str) -> Dict:
        """Main evaluation workflow."""
        print("🚀 QA Engineer v2.0 Starting Evaluation")
        print("=" * 60)
        
        # Load context (cacheable)
        system_context = self.load_context()
        print(f"📋 Loaded {len(system_context)} chars of context")
        
        # Step 1: Haiku scan
        all_issues = self.haiku_scan(code)
        
        # Step 2: Filter
        filtered_issues = self.filter_high_confidence(all_issues)
        
        # Step 3: Opus evaluation
        scorecard = self.opus_evaluate(code, filtered_issues, system_context)
        
        # Save reports
        if 'error' not in scorecard:
            self.save_reports(scorecard)
        
        print("\n" + "=" * 60)
        print("✅ Evaluation Complete!")
        
        return scorecard


def main():
    """CLI interface for QA Engineer v2.0"""
    import argparse
    
    parser = argparse.ArgumentParser(description='QA Engineer v2.0 - Advanced Code Evaluation')
    parser.add_argument('file', help='File to evaluate')
    parser.add_argument('--project-root', default='.', help='Project root directory')
    args = parser.parse_args()
    
    # Read code
    code_path = Path(args.file)
    if not code_path.exists():
        print(f"❌ File not found: {code_path}")
        exit(1)
    
    code = code_path.read_text()
    
    # Evaluate
    qa = QAEngineerV2(project_root=args.project_root)
    scorecard = qa.evaluate(code)
    
    # Summary
    if 'error' not in scorecard:
        print(f"\n📊 Final Score: {scorecard.get('overall_score', '?')}/100")
        print(f"🏆 Grade: {scorecard.get('grade', '?')}")
        print(f"💯 Confidence: {scorecard.get('overall_confidence', '?')}%")


if __name__ == "__main__":
    main()
