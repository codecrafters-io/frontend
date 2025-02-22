#! /bin/bash

# Fail immediately if any of the commands fail
set -e
set -o pipefail

LOG_FILENAME="build-output.log"
VERCEL_FUNCTIONS_DESTINATION="/vercel/output/functions"

# Run `npm run build` and capture the output into build output log
npm run build 2>&1 | tee -a "${LOG_FILENAME}"

# If there are errors in build output log - exit with error status code
if cat "${LOG_FILENAME}" | grep -qi "error"; then
  echo "Errors found in the build output"
  exit 1
else
  echo "No errors found in the build output"
fi

# Copy vercel functions to output directory
echo "Copying vercel functions to ${VERCEL_FUNCTIONS_DESTINATION}"
cp -a vercel-functions/ "${VERCEL_FUNCTIONS_DESTINATION}/"

# Run post-copying tasks for each function
find "${VERCEL_FUNCTIONS_DESTINATION}" -type d -name "*.func" | while read -r FUNCTION_DIR; do
  echo "Copying dist folder to ${FUNCTION_DIR}"
  cp -a dist/ "${FUNCTION_DIR}/dist/"

  echo "Running npm install in ${FUNCTION_DIR}"
  (cd "${FUNCTION_DIR}" && npm install --no-fund --no-audit)
done

# Exit with success status code
exit 0
