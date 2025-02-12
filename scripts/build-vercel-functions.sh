#!/bin/bash

VERCEL_FUNCTIONS_SOURCE="vercel-functions"
VERCEL_FUNCTIONS_DESTINATION="/vercel/output/functions"
VERCEL_FUNCTION_GLOB="*.func"

DIST_FOLDER_SOURCE="dist"
DIST_FOLDER_DESTINATION="dist"

REPLACE_META_TAG_UTIL_PATH="app/utils/replace-meta-tag.js"

# Copy vercel functions to output directory
echo "Copying vercel functions to ${VERCEL_FUNCTIONS_DESTINATION}"
cp -a "${VERCEL_FUNCTIONS_SOURCE}/" "${VERCEL_FUNCTIONS_DESTINATION}/" || exit 1

# Run post-copying tasks for each function
find "${VERCEL_FUNCTIONS_DESTINATION}" -type d -name "${VERCEL_FUNCTION_GLOB}" | while read -r FUNCTION_DIR; do
  echo "Copying dist folder to ${FUNCTION_DIR}"
  cp -a "${DIST_FOLDER_SOURCE}/" "${FUNCTION_DIR}/${DIST_FOLDER_DESTINATION}/" || exit 1

  echo "Copying replace-meta-tag.js to ${FUNCTION_DIR}"
  cp -a "${REPLACE_META_TAG_UTIL_PATH}" "${FUNCTION_DIR}/" || exit 1

  echo "Running npm install in ${FUNCTION_DIR}"
  (cd "${FUNCTION_DIR}" && npm install --no-fund --no-audit) || exit 1
done

# Exit with success status code
exit 0
