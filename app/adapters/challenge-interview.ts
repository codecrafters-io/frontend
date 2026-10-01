import ApplicationAdapter from './application';
import config from 'codecrafters-frontend/config/environment';

export default class ChallengeInterviewAdapter extends ApplicationAdapter {
  namespace = 'api';

  get host() {
    return config.x.interviewServiceUrl;
  }
}
