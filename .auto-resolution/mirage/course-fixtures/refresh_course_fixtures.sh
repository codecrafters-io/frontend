set -e

for course in redis docker git grep sqlite dummy; do
  echo "Fetching course definition for $course"
  gh api repos/codecrafters-io/build-your-own-$course/contents/course-definition.yml -H "Accept: application/vnd.github.raw" |
    yq -o json eval > mirage/course-fixtures/$course.js
done

gsed -i '1s/^/export default /' mirage/course-fixtures/*.js
