#! /bin/bash

LOG_FILENAME="build-output.log"
ERROR_STRING="error"

# Run `npm run build` and capture the output into `build-output.log`
npm run build > >(tee -a "${LOG_FILENAME}") 2> >(tee -a "${LOG_FILENAME}" >&2)
if [ $? -ne 0 ]; then
  echo "Running npm run build failed"
  exit 1
fi

# If there are errors in build output log - exit with error status code
if cat "${LOG_FILENAME}" | grep -qi "${ERROR_STRING}"; then
  echo "Errors found in the build output"
  exit 1
fi

# Exit with success status code
echo "No errors found in the build output"
exit 0
