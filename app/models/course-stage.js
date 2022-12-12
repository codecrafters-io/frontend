import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import { equal } from '@ember/object/computed'; // eslint-disable-line ember/no-computed-properties-in-native-classes

export default class CourseStageModel extends Model {
  @belongsTo('course', { async: false }) course;
  @belongsTo('code-walkthrough', { async: false }) sourceWalkthrough;

  @hasMany('course-stage-comments', { async: false }) comments;
  @hasMany('community-course-stage-solution', { async: false }) communitySolutions;
  @hasMany('course-stage-solution', { async: false }) solutions;

  @attr('string') difficulty;
  @attr('string') name;
  @attr('string') descriptionMarkdownTemplate;
  @attr('string') marketingMarkdown;
  @attr('number') position;
  @attr('number') approvedCommentsCount;
  @attr('') communitySolutionCounts; // JSON: { <language_slug>: count }
  @attr('string') shortName;
  @attr('string') slug;
  @attr('string') testerSourceCodeUrl;

  @equal('difficulty', 'very_easy') difficultyIsVeryEasy;
  @equal('difficulty', 'easy') difficultyIsEasy;
  @equal('difficulty', 'hard') difficultyIsHard;
  @equal('difficulty', 'medium') difficultyIsMedium;

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

  hasSolutionForLanguage(language) {
    return !!this.solutions.findBy('language', language);
  }

  hasSolutionForLanguagesOtherThan(language) {
    return this.solutions.any((solution) => solution.language !== language);
  }

  get hasSourceWalkthrough() {
    return !!this.sourceWalkthrough;
  }

  get isFirst() {
    return this === this.course.sortedStages.firstObject;
  }

  get isLast() {
    return this === this.course.sortedStages.lastObject;
  }

  get isSecond() {
    return this === this.course.sortedStages[1];
  }

  get isPenultimate() {
    return this === this.course.sortedStages[this.course.sortedStages.length - 2];
  }

  get nextStage() {
    const index = this.course.sortedStages.indexOf(this);
    console.log(index);

    return this.course.sortedStages[this.course.sortedStages.indexOf(this) + 1];
  }

  get previousStage() {
    return this.course.sortedStages[this.course.sortedStages.indexOf(this) - 1];
  }

  get solutionIsAccessibleToMembersOnly() {
    return this.position > 3;
  }
}
