Convert this Ember component file from JavaScript to TypeScript.

For example, if this file was `app/components/test.js` with these contents:

```javascript
import Component from "@glimmer/component";
import { action } from "@ember/object";

export default class TestComponent extends Component {
  @action
  async handleUserClick(user) {
    this.args.onChange(user);
  }
}
```

Your response must be:

```typescript
import Component from "@glimmer/component";
import UserModel from "codecrafters-frontend/models/user";
import { action } from "@ember/object";

type Signature = {
  Element: HTMLDivElement;

  Args: {
    onChange: (user: UserModel) => void;
  };
};

export default class TestComponent extends Component<Signature> {
  @action
  async handleUserClick(user: UserModel) {
    this.args.onChange(user);
  }
}

declare module "@glint/environment-ember-loose/registry" {
  export default interface Registry {
    Test: typeof TestComponent;
  }
}
```

Rules:

- If an Arg looks like a model, import it from `codecrafters-frontend/models/<model-name>`. If arg is "user", the import name would be "UserModel".
- Ensure you register the component in the `@glint/environment-ember-loose/registry` module using `declare module ...` at the end of the file.
- If the component is nested (example: `app/components/test/nested.js`), the registered name should include `::`, like `Test::Nested`.
