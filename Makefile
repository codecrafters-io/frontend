current_version_number := $(shell git tag --list "v*" | sort -V | tail -n 1 | cut -c 2-)
next_version_number := $(shell echo $$(($(current_version_number)+1)))

refresh_course_definitions:
	hub api repos/codecrafters-io/server/contents/codecrafters/store/data/redis.yml \
		| jq -r .content \
		| base64 -d \
		| yq -o json eval \
		> mirage/course-fixtures/redis.js

	hub api repos/codecrafters-io/server/contents/codecrafters/store/data/docker.yml \
		| jq -r .content \
		| base64 -d \
		| yq -o json eval \
		> mirage/course-fixtures/docker.js

	hub api repos/codecrafters-io/server/contents/codecrafters/store/data/git.yml \
		| jq -r .content \
		| base64 -d \
		| yq -o json eval \
		> mirage/course-fixtures/git.js

	hub api repos/codecrafters-io/server/contents/codecrafters/store/data/sqlite.yml \
		| jq -r .content \
		| base64 -d \
		| yq -o json eval \
		> mirage/course-fixtures/sqlite.js

	hub api repos/codecrafters-io/server/contents/codecrafters/store/data/react.yml \
		| jq -r .content \
		| base64 -d \
		| yq -o json eval \
		> mirage/course-fixtures/react.js

	gsed -i '1s/^/export default /' mirage/course-fixtures/*.js

release:
	git tag v$(next_version_number)
	git push origin master v$(next_version_number)
