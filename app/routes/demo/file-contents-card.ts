import Route from '@ember/routing/route';

const QUERY_PARAMS = ['foldGutter', 'headerTooltipText', 'isCollapsed', 'isCollapsible', 'scrollIntoViewOnCollapse', 'selectedDocumentIndex'];

interface QueryParamOptions {
  [key: string]: {
    replace: boolean;
  };
}

export default class DemoFileContentsCardRoute extends Route {
  queryParams = QUERY_PARAMS.reduce<QueryParamOptions>((acc, param) => {
    acc[param] = { replace: true };

    return acc;
  }, {});
}
