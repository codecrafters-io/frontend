current_version_number := $(shell git tag --list "v*" | sort -V | tail -n 1 | cut -c 2-)
next_version_number := $(shell echo $$(($(current_version_number)+1)))

sed_bin := $(shell command -v gsed 2>/dev/null || command -v sed)
# Prefer `gsed` when available (macOS), otherwise use system `sed` (Linux).
# Note: BSD sed requires `-i ''`, but we assume `gsed` is available on macOS dev envs.
sed_inplace := $(sed_bin) -i

# Support both yq flavors:
# - kislyuk/yq (Python jq wrapper): `yq '.'` reads YAML (stdin) and outputs JSON
# - mikefarah/yq (Go): `yq eval -o=json '.'` reads YAML (stdin) and outputs JSON
yq_to_json := $(shell yq --help 2>&1 | grep -q "kislyuk/yq" && echo "yq '.'" || echo "yq eval -o=json '.'")

bump_version:
	$(eval CURRENT_VERSION := $(shell $(sed_bin) -n "s/.*version: \`\([0-9]\+\).*/\1/p" config/environment.js))
	$(eval NEXT_VERSION := $(shell echo $$(($(CURRENT_VERSION) + 1))))
	$(sed_inplace) 's/version: `[0-9]\+\./version: `$(NEXT_VERSION)./' config/environment.js
	@echo "Version bumped from $(CURRENT_VERSION) to $(NEXT_VERSION) in config/environment.js"

lint:
	bun run lint:fix

refresh_concept_fixtures:
	curl https://backend.codecrafters.io/api/v1/concepts/network-protocols\?include\=questions > mirage/concept-fixtures/network-protocols.js
	curl https://backend.codecrafters.io/api/v1/concepts/tcp-overview\?include\=questions > mirage/concept-fixtures/tcp-overview.js
	curl https://backend.codecrafters.io/api/v1/concepts/dummy\?include\=questions > mirage/concept-fixtures/dummy.js
	$(sed_inplace) '1s/^/export default /' mirage/concept-fixtures/*.js

refresh_course_fixtures:
	gh api repos/codecrafters-io/build-your-own-redis/contents/course-definition.yml \
		| jq -r .content \
		| base64 -d \
		| $(yq_to_json) \
		> mirage/course-fixtures/redis.js

	gh api repos/codecrafters-io/build-your-own-docker/contents/course-definition.yml \
		| jq -r .content \
		| base64 -d \
		| $(yq_to_json) \
		> mirage/course-fixtures/docker.js

	gh api repos/codecrafters-io/build-your-own-git/contents/course-definition.yml \
		| jq -r .content \
		| base64 -d \
		| $(yq_to_json) \
		> mirage/course-fixtures/git.js

	gh api repos/codecrafters-io/build-your-own-sqlite/contents/course-definition.yml \
		| jq -r .content \
		| base64 -d \
		| $(yq_to_json) \
		> mirage/course-fixtures/sqlite.js

	gh api repos/codecrafters-io/build-your-own-grep/contents/course-definition.yml \
		| jq -r .content \
		| base64 -d \
		| $(yq_to_json) \
		> mirage/course-fixtures/grep.js

	gh api repos/codecrafters-io/build-your-own-dummy/contents/course-definition.yml \
		| jq -r .content \
		| base64 -d \
		| $(yq_to_json) \
		> mirage/course-fixtures/dummy.js

	$(sed_inplace) '1s/^/export default /' mirage/course-fixtures/*.js

serve:
	bun run start
