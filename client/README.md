admin-client *[WIP]*
====================

React and Redux application for Sherpa Admin.


---

## Javascript frameworks

Base frameworks are [React](https://reactjs.org/) and [Redux](https://github.com/reactjs/redux).

As we expect this to be a pretty big react app, some useful tools are used as a foundation.

### [Reselect](https://github.com/reactjs/reselect)
Used to create selectors from Redux-state data
- Selectors can compute derived data, allowing Redux to store the minimal possible state.
- Selectors are efficient. A selector is not recomputed unless one of its arguments change.
- Selectors are composable. They can be used as input to other selectors.


### [react-router](https://reacttraining.com/react-router/)
Declarative routing for React


### [react-router-redux](https://github.com/ReactTraining/react-router/tree/master/packages/react-router-redux)
Dispatch navigation actions from anywhere through Redux actions


### [react-universal-component](https://github.com/faceyspacey/react-universal-component)

A higher order component for loading components with dynamic imports (code splitting).


### [redux-persist v5](https://github.com/rt2zz/redux-persist/tree/v5)
Persist and rehydrate a redux store. v5 for code splitting reducers.

---

## UI library

We the UI library [Semantic UI](https://semantic-ui.com/). The themes and site overrides are included through webpack configuration.

## Stylesheets

As [Semantic UI LESS](https://github.com/Semantic-Org/Semantic-UI-LESS) use LESS, the rest of the app use it aswell. We use global styles for the core components, and use css-in-js for component-specific styles.
