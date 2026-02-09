import sys
print("Starting import test...", file=sys.stderr)
try:
    from api.tasks import router as tasks_router
    print("Import successful!", file=sys.stderr)
except Exception as e:
    print(f"Import failed: {e}", file=sys.stderr)
    import traceback
    traceback.print_exc(file=sys.stderr)