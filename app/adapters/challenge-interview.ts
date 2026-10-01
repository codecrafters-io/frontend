import ApplicationAdapter from './application';
import config from 'codecrafters-frontend/config/environment';

export default class ChallengeInterviewAdapter extends ApplicationAdapter {
  namespace = 'api';

  get host() {
    return config.x.interviewServiceUrl;
  }

  // The interview service answers errors with { error }, not JSON:API errors.
  handleResponse(status: number, headers: object, payload: object, requestData: object) {
    const message = (payload as { error?: unknown } | null)?.error;

    if (status >= 400 && typeof message === 'string' && message.length > 0) {
      return super.handleResponse(status, headers, { errors: [{ detail: message, status: String(status), title: message }] }, requestData);
    }

    return super.handleResponse(status, headers, payload, requestData);
  }
}
