export default {
  "slug": "react",
  "name": "Build your own React",
  "release_status": "alpha",
  "description_md": "In this challenge, you'll build a barebones React implementation that supports\nfunction components and hooks. Along the way, you'll learn about React's\n[API](https://reactjs.org/docs/react-api.html), [DOM-diffing\nalgorithm](https://reactjs.org/docs/reconciliation.html#the-diffing-algorithm),\n[hooks](https://reactjs.org/docs/hooks-intro.html) and more!\n",
  "short_description_md": "Learn about React's createElement API, function components, DOM-diffing algorithm, hooks and more\n",
  "completion_percentage": 10,
  "early_access_languages": [],
  "supported_languages": [
    "javascript"
  ],
  "starter_repos": {
    "javascript": "https://github.com/codecrafters-io/docker-starter-golang"
  },
  "marketing": {
    "description": "Learn about React's createElement API, function components, DOM-diffing algorithm, hooks and more",
    "difficulty": "medium",
    "introduction_md": "In this challenge, you'll build a barebones React implementation that supports\nfunction components and hooks. Along the way, you'll learn about React's\n[API](https://reactjs.org/docs/react-api.html), [DOM-diffing\nalgorithm](https://reactjs.org/docs/reconciliation.html#the-diffing-algorithm),\n[hooks](https://reactjs.org/docs/hooks-intro.html) and more!\n"
  },
  "stages": [
    {
      "slug": "init",
      "name": "Create an element",
      "description_md": "In this stage, you'll implement\n[`React.createElement`](https://reactjs.org/docs/react-api.html#createelement),\nthe function that [JSX](https://reactjs.org/docs/introducing-jsx.html)\ntranslates to internally.\n\nTo start out simple, we'll only support creating a simple HTML element\nwith no children.\n\nYour function will be called like this:\n\n```\nReact.createElement(\n  \"div\",\n  { id: \"foo\" }\n)\n```\n\nIt is expected to return a plain Javascript object like this:\n\n```\n{\n  \"type\": \"div\",\n  \"props\": { \"id\": \"foo\", \"children\": [] }\n}\n```\n\nIt's okay to omit the `children` key for now, we'll come to that in later\nstages.\n",
      "marketing_md": "In this stage, you'll implement\n[`React.createElement`](https://reactjs.org/docs/react-api.html#createelement),\nthe function that [JSX](https://reactjs.org/docs/introducing-jsx.html)\ntranslates to internally.\n\nTo start out simple, we'll only support creating a simple HTML element\nwith no children.\n"
    },
    {
      "slug": "create_element_children",
      "name": "Create an element with children",
      "description_md": "WIP\n",
      "marketing_md": "In this stage, you'll amend the function from the previous stage to add\nsupport for child elements.\n"
    },
    {
      "slug": "render_html",
      "name": "Render an element",
      "description_md": "WIP\n",
      "marketing_md": "Let's start interacting with the DOM! In this stage, you'll implement\n[`ReactDOM.render`](https://reactjs.org/docs/react-dom.html#render),\nwhich'll take an element created using `React.createElement` and render it\ninto a given HTML container.\n\nWe won't worry about updating/deleting elements at this point - just the\nfirst-time render.\n"
    },
    {
      "slug": "render_component",
      "name": "Render a component",
      "description_md": "WIP\n",
      "marketing_md": "In this stage, you'll add support for [function\ncomponents](https://reactjs.org/docs/components-and-props.html#function-and-class-components).\nWe'll amend the `React.createElement` & `ReactDOM.render` implementations\nto work with function components.\n"
    },
    {
      "slug": "render_diff",
      "name": "Re-render an element",
      "description_md": "WIP\n",
      "marketing_md": "When `ReactDOM.render` is called again after a component changes, not all\nDOM nodes are created from scratch. React runs a [heuristic diffing\nalgorithm](https://reactjs.org/docs/reconciliation.html#the-diffing-algorithm)\nto figure out the minimum transformations required to transform the DOM\ntree to the expected state. In this stage, you'll implement this\nDOM-diffing algorithm.\n"
    },
    {
      "slug": "useState",
      "name": "The useState hook",
      "description_md": "WIP\n",
      "marketing_md": "Now that we can render function components just fine, let's add state. In\nReact, this is done using\n[hooks](https://reactjs.org/docs/hooks-intro.html). In this stage, you'll\nimplement the [`useState`](https://reactjs.org/docs/hooks-state.html)\nhook.\n"
    },
    {
      "slug": "useEffect",
      "name": "The useEffect hook",
      "description_md": "WIP\n",
      "marketing_md": "This is the last stage of the challenge. We'll add support for one more\nhook: [`useEffect`](https://reactjs.org/docs/hooks-effect.html).\n"
    }
  ]
}
