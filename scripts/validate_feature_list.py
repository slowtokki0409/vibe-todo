import json
import sys
from typing import List, Dict, Any

def validate_schema(data: Dict[str, Any]) -> List[str]:
    errors = []
    
    # Root level checks
    required_root_keys = ["project_name", "last_updated", "version", "features"]
    for key in required_root_keys:
        if key not in data:
            errors.append(f"Missing root key: {key}")
            
    if "features" in data and not isinstance(data["features"], list):
        errors.append("'features' must be a list")
        return errors

    # Feature level checks
    required_feature_keys = ["id", "title", "description", "category", "priority", "user_story", "status"]
    valid_priorities = ["P0", "P1", "P2", "P3"]
    valid_categories = ["core_logic", "ui_ux", "animation", "backend", "refactor"]
    
    for idx, feature in enumerate(data.get("features", [])):
        # Check required keys
        for key in required_feature_keys:
            if key not in feature:
                errors.append(f"Feature at index {idx} ({feature.get('id', 'unknown')}) missing key: {key}")
        
        # Check Enums
        if "priority" in feature and feature["priority"] not in valid_priorities:
             errors.append(f"Feature {feature.get('id')} has invalid priority: {feature['priority']}")
             
        if "category" in feature and feature["category"] not in valid_categories:
             errors.append(f"Feature {feature.get('id')} has invalid category: {feature['category']}")

        # Check Vibe Check (AntiGravity Specific)
        if feature.get("category") in ["ui_ux", "animation"]:
            if "vibe_check" not in feature:
                 errors.append(f"Feature {feature.get('id')} is UI/Animation but missing 'vibe_check'")
    
    return errors

def main():
    if len(sys.argv) < 2:
        print("Usage: python validate_feature_list.py <path_to_json>")
        sys.exit(1)
        
    file_path = sys.argv[1]
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except FileNotFoundError:
        print(f"File not found: {file_path}")
        sys.exit(1)
    except json.JSONDecodeError as e:
        print(f"Invalid JSON: {e}")
        sys.exit(1)

    errors = validate_schema(data)
    
    if errors:
        print("❌ Validation Failed:")
        for err in errors:
            print(f"  - {err}")
        sys.exit(1)
    else:
        print("✅ Feature List Schema Validated Successfully!")
        print(f"   Project: {data.get('project_name')}")
        print(f"   Total Features: {len(data.get('features', []))}")
        sys.exit(0)

if __name__ == "__main__":
    main()
