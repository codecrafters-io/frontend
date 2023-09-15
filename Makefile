current_version_number := $(shell git tag --list "v*" | sort -V | tail -n 1 | cut -c 2-)
next_version_number := $(shell echo $$(($(current_version_number)+1)))

refresh_course_definitions:
	hub api repos/codecrafters-io/build-your-own-redis/contents/course-definition.yml \
		| jq -r .content \
		| base64 -d \
		| yq -o json eval \
		> mirage/course-fixtures/redis.js

	hub api repos/codecrafters-io/build-your-own-docker/contents/course-definition.yml \
		| jq -r .content \
		| base64 -d \
		| yq -o json eval \
		> mirage/course-fixtures/docker.js

	hub api repos/codecrafters-io/build-your-own-git/contents/course-definition.yml \
		| jq -r .content \
		| base64 -d \
		| yq -o json eval \
		> mirage/course-fixtures/git.js

	hub api repos/codecrafters-io/build-your-own-sqlite/contents/course-definition.yml \
		| jq -r .content \
		| base64 -d \
		| yq -o json eval \
		> mirage/course-fixtures/sqlite.js

	hub api repos/codecrafters-io/build-your-own-grep/contents/course-definition.yml \
		| jq -r .content \
		| base64 -d \
		| yq -o json eval \
		> mirage/course-fixtures/grep.js

	gsed -i '1s/^/export default /' mirage/course-fixtures/*.js

serve:
	npm run start
