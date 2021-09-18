current_version_number := $(shell git tag --list "v*" | sort -V | tail -n 1 | cut -c 2-)
next_version_number := $(shell echo $$(($(current_version_number)+1)))

refresh_course_definitions:
	hub api repos/rohitpaulk/codecrafters-server/contents/codecrafters/store/data/redis.yml \
		| jq -r .content \
		| base64 -d \
		| yq -o json eval \
		> mirage/course-fixtures/redis.json

	hub api repos/rohitpaulk/codecrafters-server/contents/codecrafters/store/data/docker.yml \
		| jq -r .content \
		| base64 -d \
		| yq -o json eval \
		> mirage/course-fixtures/docker.json

	hub api repos/rohitpaulk/codecrafters-server/contents/codecrafters/store/data/git.yml \
		| jq -r .content \
		| base64 -d \
		| yq -o json eval \
		> mirage/course-fixtures/git.json


release:
	git tag v$(next_version_number)
	git push origin master v$(next_version_number)
