current_version_number := $(shell git tag --list "v*" | sort -V | tail -n 1 | cut -c 2-)
next_version_number := $(shell echo $$(($(current_version_number)+1)))

refresh_course_definitions:
	hub api repos/codecrafters-io/core/contents/data/courses/redis.yml \
		| jq -r .content \
		| base64 -d \
		| yq -o json eval \
		> mirage/course-fixtures/redis.js

	hub api repos/codecrafters-io/core/contents/data/courses/docker.yml \
		| jq -r .content \
		| base64 -d \
		| yq -o json eval \
		> mirage/course-fixtures/docker.js

	hub api repos/codecrafters-io/core/contents/data/courses/git.yml \
		| jq -r .content \
		| base64 -d \
		| yq -o json eval \
		> mirage/course-fixtures/git.js

	hub api repos/codecrafters-io/core/contents/data/courses/sqlite.yml \
		| jq -r .content \
		| base64 -d \
		| yq -o json eval \
		> mirage/course-fixtures/sqlite.js

	hub api repos/codecrafters-io/core/contents/data/courses/react.yml \
		| jq -r .content \
		| base64 -d \
		| yq -o json eval \
		> mirage/course-fixtures/react.js

	hub api repos/codecrafters-io/core/contents/data/courses/grep.yml \
		| jq -r .content \
		| base64 -d \
		| yq -o json eval \
		> mirage/course-fixtures/grep.js

	gsed -i '1s/^/export default /' mirage/course-fixtures/*.js

release:
	git tag v$(next_version_number)
	git push origin master v$(next_version_number)

update_heroicons:
	ls ~/Downloads/heroicons-master/optimized/24/outline \
		| xargs -n 1 basename -s ".svg" \
		| xargs -n 1 -I {} cp ~/Downloads/heroicons-master/optimized/24/outline/{}.svg public/assets/images/heroicons/{}-outline.svg

	ls ~/Downloads/heroicons-master/optimized/24/solid \
		| xargs -n 1 basename -s ".svg" \
		| xargs -n 1 -I {} cp ~/Downloads/heroicons-master/optimized/24/solid/{}.svg public/assets/images/heroicons/{}-solid.svg
