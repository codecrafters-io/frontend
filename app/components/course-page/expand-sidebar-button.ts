import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;
}

export default class ExpandSidebarButtonComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::ExpandSidebarButton': typeof ExpandSidebarButtonComponent;
  }
}
