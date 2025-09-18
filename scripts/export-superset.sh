#!/bin/bash
set -euo pipefail

HOST_PATH="superset/dashboards"
TMP_PATH="$HOST_PATH/.tmp"

if [ ! -d "$HOST_PATH" ]; then
  echo "Folder $HOST_PATH doesn't exist... Be sure that you are in root of project (.../finsys)."
  exit 1
fi

# Exports dashboard, charts, datasources and database connections from Superset
docker exec -it finsys-superset superset export-dashboards -f /app/dashboards/dashboards.zip

# Unzip archive
unzip -o "$HOST_PATH/dashboards.zip" -d "$TMP_PATH"

# Move unzipped files from timestamped folder to path above
SUBDIR=$(find "$TMP_PATH" -maxdepth 1 -type d -name "dashboard_export_*" | head -n1)
if [ -n "$SUBDIR" ]; then
  # Clear data from path
  find "$HOST_PATH" -mindepth 1 -maxdepth 1 ! -name ".tmp" ! -name "dashboards.zip" -exec rm -rf {} +
  # Copy new data
  rsync -a "$SUBDIR"/ "$HOST_PATH"/
fi
rm -rf "$TMP_PATH"