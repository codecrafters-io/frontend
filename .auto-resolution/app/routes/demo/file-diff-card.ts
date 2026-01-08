import Route from '@ember/routing/route';

const QUERY_PARAMS = ['collapsedRanges', 'forceDarkTheme', 'highlightedRanges', 'selectedDocumentIndex', 'useCodeMirror'];

interface QueryParamOptions {
  [key: string]: {
    replace: boolean;
  };
}

export default class DemoFileDiffCardRoute extends Route {
  queryParams = QUERY_PARAMS.reduce<QueryParamOptions>((acc, param) => {
    acc[param] = { replace: true };

    return acc;
  }, {});
}
