import CourseStageModel from 'codecrafters-frontend/models/course-stage';
import LanguageModel from 'codecrafters-frontend/models/language';
import Model, { attr, belongsTo } from '@ember-data/model';
import ViewableMixin from 'codecrafters-frontend/mixins/viewable'; // eslint-disable-line ember/no-mixins
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type Store from '@ember-data/store';
import { inject as service } from '@ember/service';

export type Hint = {
  bodyMarkdown: string;
  titleMarkdown: string;
};

export default class CourseStageLanguageGuideModel extends Model.extend(ViewableMixin) {
  @service declare store: Store;
  @service declare authenticator: AuthenticatorService;

  @belongsTo('course-stage', { async: false, inverse: 'languageGuides' }) declare courseStage: CourseStageModel;
  @belongsTo('language', { async: false, inverse: null }) declare language: LanguageModel;

  // @ts-expect-error empty '' not supported
  @attr('') declare hints: Hint[] | undefined;

  @attr('boolean') declare requiresRegeneration: boolean;

  // TODO: Remove these, replace with "hints" structure
  @attr('string') declare markdownForBeginner: string;
  @attr('string') declare markdownForIntermediate: string;
  @attr('string') declare markdownForAdvanced: string;
}
