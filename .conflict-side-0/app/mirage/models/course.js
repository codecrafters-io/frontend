import { Model, hasMany } from 'miragejs';

export default Model.extend({
  buildpacks: hasMany('buildpack', { inverse: 'course' }),
  definitionUpdates: hasMany('course-definition-update', { inverse: 'course' }),
  extensionIdeas: hasMany('course-extension-idea', { inverse: 'course' }),
  extensions: hasMany('course-extension', { inverse: 'course' }),
  languageConfigurations: hasMany('course-language-configuration', { inverse: 'course' }),
  stages: hasMany('course-stage', { inverse: 'course' }),
  testerVersions: hasMany('course-tester-version', { inverse: 'course' }),
});
