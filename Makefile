current_version_number := $(shell git tag --list "v*" | sort -V | tail -n 1 | cut -c 2-)
next_version_number := $(shell echo $$(($(current_version_number)+1)))

bump_version:
	$(eval CURRENT_VERSION := $(shell gsed -n "s/.*version: \`\([0-9]\+\).*/\1/p" config/environment.js))
	$(eval NEXT_VERSION := $(shell echo $$(($(CURRENT_VERSION) + 1))))
	gsed -i 's/version: `[0-9]\+\./version: `$(NEXT_VERSION)./' config/environment.js
	@echo "Version bumped from $(CURRENT_VERSION) to $(NEXT_VERSION) in config/environment.js"

lint:
	npm run lint:fix

refresh_concept_fixtures:
	curl https://backend.codecrafters.io/api/v1/concepts/network-protocols\?include\=questions > mirage/concept-fixtures/network-protocols.js
	curl https://backend.codecrafters.io/api/v1/concepts/tcp-overview\?include\=questions > mirage/concept-fixtures/tcp-overview.js
	curl https://backend.codecrafters.io/api/v1/concepts/dummy\?include\=questions > mirage/concept-fixtures/dummy.js
	gsed -i '1s/^/export default /' mirage/concept-fixtures/*.js

refresh_course_fixtures:
	./scripts/refresh-course-fixtures.sh

serve:
	npm run start
