import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import { equal } from '@ember/object/computed'; // eslint-disable-line ember/no-computed-properties-in-native-classes

export default class CourseStageModel extends Model {
  @belongsTo('course', { async: false }) course;

  @hasMany('course-stage-comments', { async: false }) comments;
  @hasMany('community-course-stage-solution', { async: false, inverse: 'courseStage' }) communitySolutions;
  @hasMany('course-stage-solution', { async: false }) solutions;
  @hasMany('course-stage-screencast', { async: false, inverse: 'courseStage' }) screencasts;

  @attr('') conceptSlugs; // Array of strings
  @attr('string') difficulty;
  @attr('boolean') isPaid;
  @attr('string') name;
  @attr('string') descriptionMarkdownTemplate;
  @attr('string') marketingMarkdown;
  @attr('number') position; // TODO: Remove usages of this
  @attr('number') positionWithinCourse;
  @attr('number') positionWithinExtension;
  @attr('number') approvedCommentsCount;
  @attr('') communitySolutionCounts; // JSON: { <language_slug>: count }
  @attr('string') shortName;
  @attr('string') slug;
  @attr('string') primaryExtensionSlug;
  @attr('') secondaryExtensionSlugs; // Array of strings
  @attr('string') testerSourceCodeUrl;

  @equal('difficulty', 'very_easy') difficultyIsVeryEasy;
  @equal('difficulty', 'easy') difficultyIsEasy;
  @equal('difficulty', 'hard') difficultyIsHard;
  @equal('difficulty', 'medium') difficultyIsMedium;

  get concepts() {
    return this.store.peekAll('concept').filter((concept) => this.conceptSlugs.includes(concept.slug));
  }

  get hasApprovedComments() {
    return this.approvedCommentsCount > 0;
  }

  hasCommunitySolutionsForLanguage(language) {
    return ((this.communitySolutionCounts || {})[language.slug] || 0) > 0;
  }

  hasCommunitySolutionsForLanguagesOtherThan(language) {
    for (let [languageSlug, solutionsCount] of Object.entries(this.communitySolutionCounts || {})) {
      if (solutionsCount > 0 && languageSlug !== language.slug) {
        return true;
      }
    }

    return false;
  }

  get hasConcepts() {
    return this.conceptSlugs && this.conceptSlugs.length > 0;
  }

  get hasScreencasts() {
    return this.screencasts.length > 0;
  }

  hasSolutionForLanguage(language) {
    return !!this.solutions.findBy('language', language);
  }

  hasSolutionForLanguagesOtherThan(language) {
    return this.solutions.any((solution) => solution.language !== language);
  }

  get identifierForURL() {
    if (this.isBaseStage) {
      return `${this.positionWithinCourse}`; // Example: /stages/3
    } else {
      return `${this.primaryExtensionSlug}:${this.positionWithinExtension}`; // Example: /stages/ext2:1
    }
  }

  get isBaseStage() {
    return !this.primaryExtensionSlug;
  }

  get isFirst() {
    return this === this.course.sortedStages.firstObject;
  }

  get isFree() {
    return !this.isPaid;
  }

  get isLast() {
    return this === this.course.sortedStages.lastObject;
  }

  get isSecond() {
    return this === this.course.sortedStages[1];
  }

  get isThird() {
    return this === this.course.sortedStages[2];
  }

  get isPenultimate() {
    return this === this.course.sortedStages[this.course.sortedStages.length - 2];
  }

  // TODO[Extensions]: Different logic if from extension vs. not
  get nextStage() {
    return this.course.sortedStages[this.course.sortedStages.indexOf(this) + 1];
  }

  get otherConceptsForCourse() {
    return this.course.concepts.reject((concept) => this.concepts.includes(concept));
  }

  get previousStage() {
    return this.course.sortedStages[this.course.sortedStages.indexOf(this) - 1];
  }

  get primaryExtension() {
    return this.course.extensions.find((extension) => extension.slug === this.primaryExtensionSlug);
  }

  get secondaryExtensions() {
    return this.course.extensions.filter((extension) => this.secondaryExtensionSlugs.includes(extension.slug));
  }

  get solutionIsAccessibleToMembersOnly() {
    return this.position > 3;
  }
}
