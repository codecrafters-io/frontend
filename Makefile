current_version_number := $(shell git tag --list "v*" | sort -V | tail -n 1 | cut -c 2-)
next_version_number := $(shell echo $$(($(current_version_number)+1)))

refresh_concept_fixtures:
	curl https://backend.codecrafters.io/api/v1/concepts/network-protocols\?include\=questions > mirage/concept-fixtures/network-protocols.js
	curl https://backend.codecrafters.io/api/v1/concepts/tcp-overview\?include\=questions > mirage/concept-fixtures/tcp-overview.js
	curl https://backend.codecrafters.io/api/v1/concepts/dummy\?include\=questions > mirage/concept-fixtures/dummy.js
	gsed -i '1s/^/export default /' mirage/concept-fixtures/*.js

refresh_course_fixtures:
	gh api repos/codecrafters-io/build-your-own-redis/contents/course-definition.yml \
		| jq -r .content \
		| base64 -d \
		| yq -o json eval \
		> mirage/course-fixtures/redis.js

	gh api repos/codecrafters-io/build-your-own-docker/contents/course-definition.yml \
		| jq -r .content \
		| base64 -d \
		| yq -o json eval \
		> mirage/course-fixtures/docker.js

	gh api repos/codecrafters-io/build-your-own-git/contents/course-definition.yml \
		| jq -r .content \
		| base64 -d \
		| yq -o json eval \
		> mirage/course-fixtures/git.js

	gh api repos/codecrafters-io/build-your-own-sqlite/contents/course-definition.yml \
		| jq -r .content \
		| base64 -d \
		| yq -o json eval \
		> mirage/course-fixtures/sqlite.js

	gh api repos/codecrafters-io/build-your-own-grep/contents/course-definition.yml \
		| jq -r .content \
		| base64 -d \
		| yq -o json eval \
		> mirage/course-fixtures/grep.js

	gh api repos/codecrafters-io/build-your-own-dummy/contents/course-definition.yml \
		| jq -r .content \
		| base64 -d \
		| yq -o json eval \
		> mirage/course-fixtures/dummy.js

	gsed -i '1s/^/export default /' mirage/course-fixtures/*.js

serve:
	npm run start
