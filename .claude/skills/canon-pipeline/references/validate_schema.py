#!/usr/bin/env python3
"""
Minimal JSON Schema (draft 2020-12 subset) validator.
Supports: type, properties, required, additionalProperties, items,
enum, const, pattern, minimum, maximum, minLength, minItems, maxItems,
$ref (local #/definitions/... only), format (uri/date-time - checked loosely).
Good enough to validate the CANON book schema against real data without
needing network access to pip install the full jsonschema package.
"""
import json
import re
import sys


def resolve_ref(ref, root):
    assert ref.startswith("#/")
    parts = ref[2:].split("/")
    node = root
    for p in parts:
        node = node[p]
    return node


def validate(instance, schema, root, path="$"):
    errors = []

    if "$ref" in schema:
        target = resolve_ref(schema["$ref"], root)
        errors.extend(validate(instance, target, root, path))
        return errors

    if "const" in schema:
        if instance != schema["const"]:
            errors.append(f"{path}: expected const {schema['const']!r}, got {instance!r}")
        return errors

    if "enum" in schema:
        if instance not in schema["enum"]:
            errors.append(f"{path}: {instance!r} not in enum {schema['enum']}")
        return errors

    t = schema.get("type")
    if t == "object":
        if not isinstance(instance, dict):
            errors.append(f"{path}: expected object, got {type(instance).__name__}")
            return errors
        required = schema.get("required", [])
        for r in required:
            if r not in instance:
                errors.append(f"{path}: missing required field '{r}'")
        props = schema.get("properties", {})
        additional = schema.get("additionalProperties", True)
        for k, v in instance.items():
            if k in props:
                errors.extend(validate(v, props[k], root, f"{path}.{k}"))
            elif additional is False:
                errors.append(f"{path}.{k}: additional property not allowed")

    elif t == "array":
        if not isinstance(instance, list):
            errors.append(f"{path}: expected array, got {type(instance).__name__}")
            return errors
        if "minItems" in schema and len(instance) < schema["minItems"]:
            errors.append(f"{path}: array has {len(instance)} items, minItems={schema['minItems']}")
        if "maxItems" in schema and len(instance) > schema["maxItems"]:
            errors.append(f"{path}: array has {len(instance)} items, maxItems={schema['maxItems']}")
        items_schema = schema.get("items")
        if items_schema:
            for i, item in enumerate(instance):
                errors.extend(validate(item, items_schema, root, f"{path}[{i}]"))

    elif t == "string":
        if not isinstance(instance, str):
            errors.append(f"{path}: expected string, got {type(instance).__name__}")
            return errors
        if "minLength" in schema and len(instance) < schema["minLength"]:
            errors.append(f"{path}: string too short (minLength={schema['minLength']})")
        if "pattern" in schema:
            if not re.match(schema["pattern"], instance):
                errors.append(f"{path}: {instance!r} does not match pattern {schema['pattern']!r}")
        # format checks are advisory-only here (uri/date-time) — skip strict validation

    elif t == "integer":
        if not isinstance(instance, int) or isinstance(instance, bool):
            errors.append(f"{path}: expected integer, got {type(instance).__name__}")
            return errors
        if "minimum" in schema and instance < schema["minimum"]:
            errors.append(f"{path}: {instance} < minimum {schema['minimum']}")
        if "maximum" in schema and instance > schema["maximum"]:
            errors.append(f"{path}: {instance} > maximum {schema['maximum']}")

    elif t == "number":
        if not isinstance(instance, (int, float)) or isinstance(instance, bool):
            errors.append(f"{path}: expected number, got {type(instance).__name__}")
            return errors
        if "minimum" in schema and instance < schema["minimum"]:
            errors.append(f"{path}: {instance} < minimum {schema['minimum']}")
        if "maximum" in schema and instance > schema["maximum"]:
            errors.append(f"{path}: {instance} > maximum {schema['maximum']}")

    elif t == "boolean":
        if not isinstance(instance, bool):
            errors.append(f"{path}: expected boolean, got {type(instance).__name__}")

    return errors


def main():
    schema_path = sys.argv[1] if len(sys.argv) > 1 else "canon-book.schema.json"
    data_path = sys.argv[2] if len(sys.argv) > 2 else "CANON-Genesis.json"

    with open(schema_path) as f:
        schema = json.load(f)
    with open(data_path) as f:
        data = json.load(f)

    errors = validate(data, schema, schema)

    if not errors:
        print(f"✅ VALID — {data_path} conforms to {schema_path}")
        return 0
    else:
        print(f"❌ {len(errors)} validation error(s) in {data_path}:\n")
        for e in errors:
            print("  -", e)
        return 1


if __name__ == "__main__":
    sys.exit(main())
