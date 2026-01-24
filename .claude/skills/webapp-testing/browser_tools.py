"""
Browser Tools for webapp-testing Skill
Inspired by: claude-quickstarts/browser-tools-api-demo
Purpose: Enable natural language web testing with Claude
"""

# Browser Navigation and Interaction Tools
BROWSER_TOOLS = [
    {
        "name": "navigate_to_url",
        "description": "Navigate browser to a URL and wait for page load. Returns page title and screenshot.",
        "input_schema": {
            "type": "object",
            "properties": {
                "url": {
                    "type": "string",
                    "description": "Full URL to navigate to (e.g., http://localhost:3000)"
                },
                "wait_for_selector": {
                    "type": "string",
                    "description": "Optional CSS selector to wait for before returning"
                },
                "timeout_ms": {
                    "type": "integer",
                    "description": "Timeout in milliseconds (default: 30000)",
                    "default": 30000
                }
            },
            "required": ["url"]
        }
    },
    {
        "name": "click_element",
        "description": "Click on an element by CSS selector. Returns success status and screenshot after click.",
        "input_schema": {
            "type": "object",
            "properties": {
                "selector": {
                    "type": "string",
                    "description": "CSS selector of element to click (e.g., '#submit-button')"
                },
                "expect_navigation": {
                    "type": "boolean",
                    "description": "Whether to wait for navigation after click",
                    "default": false
                },
                "wait_after_ms": {
                    "type": "integer",
                    "description": "Milliseconds to wait after click (default: 500)",
                    "default": 500
                }
            },
            "required": ["selector"]
        }
    },
    {
        "name": "fill_form_field",
        "description": "Fill a form field with text. Returns success status.",
        "input_schema": {
            "type": "object",
            "properties": {
                "selector": {
                    "type": "string",
                    "description": "CSS selector of input field (e.g., '#username')"
                },
                "text": {
                    "type": "string",
                    "description": "Text to fill into the field"
                },
                "clear_first": {
                    "type": "boolean",
                    "description": "Whether to clear field before filling",
                    "default": true
                }
            },
            "required": ["selector", "text"]
        }
    },
    {
        "name": "verify_element_exists",
        "description": "Check if an element exists and is visible on the page.",
        "input_schema": {
            "type": "object",
            "properties": {
                "selector": {
                    "type": "string",
                    "description": "CSS selector to verify"
                },
                "should_exist": {
                    "type": "boolean",
                    "description": "Expected existence (true = should exist, false = should NOT exist)",
                    "default": true
                },
                "visible_only": {
                    "type": "boolean",
                    "description": "Only count visible elements",
                    "default": true
                }
            },
            "required": ["selector"]
        }
    },
    {
        "name": "get_element_text",
        "description": "Get the text content of an element.",
        "input_schema": {
            "type": "object",
            "properties": {
                "selector": {
                    "type": "string",
                    "description": "CSS selector of element"
                }
            },
            "required": ["selector"]
        }
    },
    {
        "name": "take_screenshot",
        "description": "Take a screenshot of current page or specific element.",
        "input_schema": {
            "type": "object",
            "properties": {
                "selector": {
                    "type": "string",
                    "description": "Optional CSS selector to screenshot specific element (default: full page)"
                },
                "name": {
                    "type": "string",
                    "description": "Name for screenshot file (default: auto-generated)"
                }
            }
        }
    },
    {
        "name": "wait_for_element",
        "description": "Wait for an element to appear on the page.",
        "input_schema": {
            "type": "object",
            "properties": {
                "selector": {
                    "type": "string",
                    "description": "CSS selector to wait for"
                },
                "state": {
                    "type": "string",
                    "enum": ["attached", "detached", "visible", "hidden"],
                    "description": "Element state to wait for",
                    "default": "visible"
                },
                "timeout_ms": {
                    "type": "integer",
                    "description": "Timeout in milliseconds (default: 30000)",
                    "default": 30000
                }
            },
            "required": ["selector"]
        }
    },
    {
        "name": "get_page_info",
        "description": "Get current page information (URL, title, etc).",
        "input_schema": {
            "type": "object",
            "properties": {
                "include_html": {
                    "type": "boolean",
                    "description": "Include page HTML in response",
                    "default": false
                }
            }
        }
    }
]


def create_browser_tools():
    """
    Returns browser automation tools for Claude Tool Use.
    
    Enables natural language web testing:
    
    Example:
        User: "Test the login flow"
        Claude:
        1. navigate_to_url(url="http://localhost:3000/login")
        2. fill_form_field(selector="#username", text="test@example.com")
        3. fill_form_field(selector="#password", text="password123")
        4. click_element(selector="#submit", expect_navigation=true)
        5. verify_element_exists(selector=".dashboard", should_exist=true)
        6. take_screenshot(name="login_success")
    """
    return BROWSER_TOOLS
