courses=("redis" "docker" "git" "sqlite" "grep" "shell" "dummy")

tmpDir=$(mktemp -d)

for course in "${courses[@]}"; do
  git clone "https://github.com/codecrafters-io/build-your-own-${course}.git" "${tmpDir}/${course}" &
done

wait

mkdir -p mirage/course-fixtures
rm -rf mirage/course-fixtures/*

for course in "${courses[@]}"; do
  ruby ./scripts/generate-course-fixture-from-definition-repository.rb "${tmpDir}/${course}" >"mirage/course-fixtures/${course}.js"
done

rm -rf ${tmpDir}
