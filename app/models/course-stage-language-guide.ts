import CourseStageModel from 'codecrafters-frontend/models/course-stage';
import Model, { attr, belongsTo } from '@ember-data/model';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type Store from '@ember-data/store';
import { TemporaryLanguageModel } from 'codecrafters-frontend/lib/temporary-types';
import { inject as service } from '@ember/service';

/* eslint-disable ember/no-mixins */
import ViewableMixin from 'codecrafters-frontend/mixins/viewable';

export default class CourseStageLanguageGuideModel extends Model.extend(ViewableMixin) {
  @service declare store: Store;
  @service declare authenticator: AuthenticatorService;

  @belongsTo('course-stage', { async: false, inverse: 'languageGuides' }) declare courseStage: CourseStageModel;
  @belongsTo('language', { async: false, inverse: null }) declare language: TemporaryLanguageModel;

  @attr('string') declare markdownForBeginner: string;
  @attr('string') declare markdownForIntermediate: string;
  @attr('string') declare markdownForAdvanced: string;
  @attr('boolean') declare requiresRegeneration: boolean;
}
