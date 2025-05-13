import ApplicationAdapter from './application';

export default class CommunitySolutionsAnalysisAdapter extends ApplicationAdapter {
  pathForType() {
    return 'community-solutions-analyses';
  }

  normalizeResponse(store, primaryModelClass, payload, id, requestType) {
    // Extract and normalize changed lines distribution
    payload.data.forEach((item) => {
      if (item.attributes['changed-lines-count-distribution']) {
        const distribution = item.attributes['changed-lines-count-distribution'];

        // Add these directly to the attributes to match the model
        item.attributes['p25'] = distribution.p25 || 0;
        item.attributes['p50'] = distribution.p50 || 0;
        item.attributes['p75'] = distribution.p75 || 0;
        item.attributes['p90'] = distribution.p90 || 0;
        item.attributes['p95'] = distribution.p95 || 0;
      }
    });

    return super.normalizeResponse(store, primaryModelClass, payload, id, requestType);
  }
}
