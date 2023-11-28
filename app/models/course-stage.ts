import CommunityCourseStageSolutionModel from 'codecrafters-frontend/models/community-course-stage-solution';
import CourseStageCommentModel from 'codecrafters-frontend/models/course-stage-comment';
import CourseStageLanguageGuideModel from 'codecrafters-frontend/models/course-stage-language-guide';
import CourseStageScreencastModel from 'codecrafters-frontend/models/course-stage-screencast';
import CourseStageSolutionModel from 'codecrafters-frontend/models/course-stage-solution';
import CourseModel from 'codecrafters-frontend/models/course';
import LanguageModel from 'codecrafters-frontend/models/language';
import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import { equal } from '@ember/object/computed'; // eslint-disable-line ember/no-computed-properties-in-native-classes

export default class CourseStageModel extends Model {
  @belongsTo('course', { async: false }) course!: CourseModel;

  @hasMany('course-stage-comments', { async: false }) comments!: CourseStageCommentModel[];
  @hasMany('community-course-stage-solution', { async: false, inverse: 'courseStage' }) communitySolutions!: CommunityCourseStageSolutionModel[];
  @hasMany('course-stage-language-guide', { async: false }) languageGuides!: CourseStageLanguageGuideModel[];
  @hasMany('course-stage-solution', { async: false }) solutions!: CourseStageSolutionModel[];
  @hasMany('course-stage-screencast', { async: false, inverse: 'courseStage' }) screencasts!: CourseStageScreencastModel[];

  @attr() conceptSlugs!: string[]; // Array of strings
  @attr('string') difficulty!: string;
  @attr('boolean') isPaid!: boolean;
  @attr('string') name!: string;
  @attr('string') descriptionMarkdownTemplate!: string;
  @attr('string') marketingMarkdown!: string;
  @attr('number') position!: number; // TODO: Remove usages of this
  @attr('number') positionWithinCourse!: number;
  @attr('number') positionWithinExtension!: number;
  @attr('number') approvedCommentsCount!: number;
  @attr() communitySolutionCounts!: { [key: string]: number }; // JSON: { <language_slug>: count }
  @attr('string') shortName!: string;
  @attr('string') slug!: string;
  @attr('string') primaryExtensionSlug!: string;
  @attr() secondaryExtensionSlugs!: string[];
  @attr('string') testerSourceCodeUrl!: string;

  @equal('difficulty', 'very_easy') difficultyIsVeryEasy!: boolean;
  @equal('difficulty', 'easy') difficultyIsEasy!: boolean;
  @equal('difficulty', 'hard') difficultyIsHard!: boolean;
  @equal('difficulty', 'medium') difficultyIsMedium!: boolean;

  get concepts() {
    return this.store.peekAll('concept').filter((concept) => this.conceptSlugs.includes(concept.slug));
  }

  get hasApprovedComments() {
    return this.approvedCommentsCount > 0;
  }

  get hasConcepts() {
    return this.conceptSlugs && this.conceptSlugs.length > 0;
  }

  get hasScreencasts() {
    return this.screencasts.length > 0;
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

  get isExtensionStage() {
    return !this.isBaseStage;
  }

  get isFirst() {
    return this === this.course.sortedBaseStages.firstObject;
  }

  get isFree() {
    return !this.isPaid;
  }

  // TODO: Change usages to account for extensions!
  get isLast() {
    return this === this.course.sortedBaseStages.lastObject;
  }

  get isPenultimate() {
    return this === this.course.sortedBaseStages[this.course.sortedBaseStages.length - 2];
  }

  get isSecond() {
    return this === this.course.sortedBaseStages[1];
  }

  get isThird() {
    return this === this.course.sortedBaseStages[2];
  }

  get otherConceptsForCourse() {
    return this.course.concepts.reject((concept) => this.concepts.includes(concept));
  }

  get positionWithinExtensionOrCourse() {
    return this.isBaseStage ? this.positionWithinCourse : this.positionWithinExtension;
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

  hasCommunitySolutionsForLanguage(language: LanguageModel) {
    return ((this.communitySolutionCounts || {})[language.slug] || 0) > 0;
  }

  hasCommunitySolutionsForLanguagesOtherThan(language: LanguageModel) {
    for (const [languageSlug, solutionsCount] of Object.entries(this.communitySolutionCounts || {})) {
      if (solutionsCount > 0 && languageSlug !== language.slug) {
        return true;
      }
    }

    return false;
  }

  hasSolutionForLanguage(language: LanguageModel) {
    return !!this.solutions.findBy('language', language);
  }

  hasSolutionForLanguagesOtherThan(language: LanguageModel) {
    return this.solutions.any((solution) => solution.language !== language);
  }
}
