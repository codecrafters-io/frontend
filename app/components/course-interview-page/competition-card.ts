import Component from '@glimmer/component';
import type PartnerCompetitionModel from 'codecrafters-frontend/models/partner-competition';
import type RepositoryModel from 'codecrafters-frontend/models/repository';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    competition: PartnerCompetitionModel;
    repository: RepositoryModel;
  };
}

export default class CourseInterviewPageCompetitionCard extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseInterviewPage::CompetitionCard': typeof CourseInterviewPageCompetitionCard;
  }
}
