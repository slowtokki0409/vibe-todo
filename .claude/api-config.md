# Claude API Configuration for Caching & Advanced Features

## Prompt Caching Configuration

### Cacheable Resources (Global)
These resources are large and rarely change - perfect for caching:

- `~/.claude/CLAUDE.md` - Personal coding standards (updated monthly)
- `~/.claude/skills/*/SKILL.md` - Skill definitions (updated weekly)
- `~/.claude/templates/*.template` - Project templates (rarely updated)

### Cache Strategy
- **Type**: Ephemeral (5 minutes)
- **Scope**: User-level
- **Benefit**: 90% cost reduction for repeated evaluations

---

## JSON Mode Configuration

### Scorecard JSON Schema
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["overall_score", "overall_confidence", "timestamp", "categories"],
  "properties": {
    "overall_score": {
      "type": "number",
      "minimum": 0,
      "maximum": 100,
      "description": "Total score out of 100"
    },
    "overall_confidence": {
      "type": "number",
      "minimum": 0,
      "maximum": 100,
      "description": "Weighted average confidence of all issues"
    },
    "timestamp": {
      "type": "string",
      "format": "date-time"
    },
    "grade": {
      "type": "string",
      "enum": ["S+", "S", "A", "B", "C", "F"]
    },
    "categories": {
      "type": "object",
      "required": ["code_quality", "ui_ux", "functionality", "performance"],
      "properties": {
        "code_quality": {
          "$ref": "#/definitions/category"
        },
        "ui_ux": {
          "$ref": "#/definitions/category"
        },
        "functionality": {
          "$ref": "#/definitions/category"
        },
        "performance": {
          "$ref": "#/definitions/category"
        }
      }
    },
    "priority_actions": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "issue": {"type": "string"},
          "confidence": {"type": "number"},
          "severity": {"type": "string", "enum": ["critical", "important", "recommended"]}
        }
      }
    }
  },
  "definitions": {
    "category": {
      "type": "object",
      "required": ["score", "confidence", "issues"],
      "properties": {
        "score": {
          "type": "number",
          "minimum": 0,
          "maximum": 25
        },
        "confidence": {
          "type": "number",
          "minimum": 0,
          "maximum": 100
        },
        "issues": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/issue"
          }
        }
      }
    },
    "issue": {
      "type": "object",
      "required": ["severity", "confidence", "description", "deduction"],
      "properties": {
        "severity": {
          "type": "string",
          "enum": ["critical", "important", "recommended", "suggestion"]
        },
        "confidence": {
          "type": "number",
          "minimum": 0,
          "maximum": 100
        },
        "description": {
          "type": "string"
        },
        "evidence": {
          "type": "string"
        },
        "fix": {
          "type": "string"
        },
        "deduction": {
          "type": "number"
        }
      }
    }
  }
}
```

---

## Sub-agents Configuration

### Model Selection
- **Haiku**: `claude-3-haiku-20250122` (Fast, cheap scanning)
- **Sonnet**: `claude-3-5-sonnet-20241022` (Balanced)
- **Opus**: `claude-opus-4-20250514` (Powerful, accurate evaluation)

### Workflow
1. **Haiku** (Sub-agent): Initial scan (30s, $0.05)
   - Scan entire codebase
   - Identify 50-100 potential issues
   - Assign preliminary confidence (60-80 range)

2. **Filter**: Confidence threshold (≥70)
   - Reduce to 10-20 high-confidence issues

3. **Opus** (Main agent): Deep analysis (10s, $0.15)
   - Analyze filtered issues only
   - Generate final Scorecard
   - Confidence ≥90 for critical issues

### Cost Comparison
- **Before**: Opus only = $0.50/evaluation
- **After**: Haiku + Opus = $0.20/evaluation (60% savings)

---

## API Usage Patterns

### Pattern 1: Cached System Prompt
```python
# Read cacheable resources
antigravity_md = read_file('ANTIGRAVITY.md')
scorecard_md = read_file('.claude/Scorecard.md')
skill_md = read_file('~/.claude/skills/qa-engineer/SKILL.md')

system_context = f"""
{antigravity_md}

{scorecard_md}

{skill_md}
"""

# Create message with caching
response = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    max_tokens=4096,
    system=[
        {
            "type": "text",
            "text": system_context,
            "cache_control": {"type": "ephemeral"}  # Cache for 5 minutes
        }
    ],
    messages=[{"role": "user", "content": "Evaluate this code..."}]
)
```

### Pattern 2: JSON Mode Response
```python
response = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    max_tokens=4096,
    response_format={"type": "json_object"},  # Force JSON
    messages=[
        {
            "role": "user",
            "content": """Evaluate this code and return a JSON scorecard.
            
            Use this exact schema:
            {
              "overall_score": 85,
              "overall_confidence": 87,
              "grade": "A",
              "categories": {...}
            }
            """
        }
    ]
)

# Always valid JSON
scorecard = json.loads(response.content[0].text)
```

### Pattern 3: Sub-agent Workflow
```python
# Step 1: Haiku scan
haiku_response = client.messages.create(
    model="claude-3-haiku-20250122",
    max_tokens=2048,
    messages=[{
        "role": "user",
        "content": "Scan this code for ALL potential issues. Be thorough but fast."
    }]
)

# Step 2: Filter high-confidence
haiku_issues = parse_issues(haiku_response)
high_confidence_issues = [i for i in haiku_issues if i.confidence >= 70]

# Step 3: Opus deep analysis
opus_response = client.messages.create(
    model="claude-opus-4-20250514",
    max_tokens=4096,
    response_format={"type": "json_object"},
    system=[{"type": "text", "text": scorecard_schema, "cache_control": {"type": "ephemeral"}}],
    messages=[{
        "role": "user",
        "content": f"""Review these {len(high_confidence_issues)} issues from initial scan:
        
        {json.dumps(high_confidence_issues, indent=2)}
        
        Confirm which are real problems and generate final JSON scorecard."""
    }]
)

final_scorecard = json.loads(opus_response.content[0].text)
```

---

## Performance Metrics to Track

### Cost Metrics
- Tokens sent (input)
- Tokens received (output)
- Cache hits / Cache misses
- Cost per evaluation

### Quality Metrics
- S+ grade achievement rate
- False positive rate (confidence <70)
- Average confidence score
- User satisfaction

### Speed Metrics
- Time to first response
- Total evaluation time
- Cache hit latency (<100ms)
- Cache miss latency (~2s)

---

**Version**: 1.0  
**Last Updated**: 2026-01-17  
**Maintained By**: AntiGravity AI
