"""
Tool Definitions for QA Engineer v2.1
Uses Claude Tool Use for 100% guaranteed JSON output
"""

# Scorecard Tool Definition
SCORECARD_TOOL = {
    "name": "generate_qa_scorecard",
    "description": "Generate a complete QA evaluation scorecard in structured JSON format based on code analysis.",
    "input_schema": {
        "type": "object",
        "properties": {
            "overall_score": {
                "type": "integer",
                "minimum": 0,
                "maximum": 100,
                "description": "Total quality score out of 100"
            },
            "overall_confidence": {
                "type": "integer",
                "minimum": 0,
                "maximum": 100,
                "description": "Weighted average confidence of all issues found"
            },
            "timestamp": {
                "type": "string",
                "description": "ISO 8601 timestamp of evaluation"
            },
            "grade": {
                "type": "string",
                "enum": ["S+", "S", "A", "B", "C", "F"],
                "description": "Letter grade based on score"
            },
            "categories": {
                "type": "object",
                "properties": {
                    "code_quality": {
                        "type": "object",
                        "properties": {
                            "score": {
                                "type": "integer",
                                "minimum": 0,
                                "maximum": 25,
                                "description": "Code quality score out of 25"
                            },
                            "confidence": {
                                "type": "integer",
                                "minimum": 0,
                                "maximum": 100,
                                "description": "Average confidence of code quality issues"
                            },
                            "issues": {
                                "type": "array",
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "severity": {
                                            "type": "string",
                                            "enum": ["critical", "important", "recommended", "suggestion"]
                                        },
                                        "confidence": {
                                            "type": "integer",
                                            "minimum": 0,
                                            "maximum": 100
                                        },
                                        "description": {"type": "string"},
                                        "evidence": {"type": "string"},
                                        "fix": {"type": "string"},
                                        "deduction": {"type": "integer"}
                                    },
                                    "required": ["severity", "confidence", "description", "deduction"]
                                }
                            }
                        },
                        "required": ["score", "confidence", "issues"]
                    },
                    "ui_ux": {
                        "type": "object",
                        "properties": {
                            "score": {"type": "integer", "minimum": 0, "maximum": 25},
                            "confidence": {"type": "integer", "minimum": 0, "maximum": 100},
                            "issues": {"type": "array"}
                        },
                        "required": ["score", "confidence", "issues"]
                    },
                    "functionality": {
                        "type": "object",
                        "properties": {
                            "score": {"type": "integer", "minimum": 0, "maximum": 25},
                            "confidence": {"type": "integer", "minimum": 0, "maximum": 100},
                            "issues": {"type": "array"}
                        },
                        "required": ["score", "confidence", "issues"]
                    },
                    "performance": {
                        "type": "object",
                        "properties": {
                            "score": {"type": "integer", "minimum": 0, "maximum": 25},
                            "confidence": {"type": "integer", "minimum": 0, "maximum": 100},
                            "issues": {"type": "array"}
                        },
                        "required": ["score", "confidence", "issues"]
                    }
                },
                "required": ["code_quality", "ui_ux", "functionality", "performance"]
            },
            "priority_actions": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "issue": {"type": "string"},
                        "confidence": {"type": "integer"},
                        "severity": {
                            "type": "string",
                            "enum": ["critical", "important", "recommended"]
                        }
                    },
                    "required": ["issue", "confidence", "severity"]
                }
            }
        },
        "required": ["overall_score", "overall_confidence", "timestamp", "grade", "categories", "priority_actions"]
    }
}


def create_scorecard_tool():
    """
    Returns the scorecard tool definition for Claude Tool Use.
    
    This guarantees 100% valid JSON output with schema validation.
    Much more reliable than JSON mode or prefilling.
    """
    return SCORECARD_TOOL
