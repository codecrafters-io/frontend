import Route from '@ember/routing/route';

const QUERY_PARAMS = ['forceDarkTheme', 'selectedDocumentIndex', 'useCodeMirror'];

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
