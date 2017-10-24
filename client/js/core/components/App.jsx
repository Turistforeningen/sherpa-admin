import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import universal from 'react-universal-component';
import universalOptions from 'core/universalOptions';
import log from 'lib/log';

import inc from 'core/actions/user/inc';
import { getFetchTimestamp, getInc } from 'core/selectors/user';

import { Button } from 'semantic-ui-react';


const Example = universal(
  () => import('shared-components/example'),
  {
    ...universalOptions,
    resolve: (props) => require.resolveWeak('shared-components/example'),
  }
);


class App extends Component {
  constructor(props) {
    super(props);

    this.state = { loadExample: false };
  }

  @autobind
  lazyLoadExample() {
    this.setState({ loadExample: !this.state.loadExample });
  }

  render() {
    const {
      persistor,
      actions,
      incValue,
      fetchTimestamp,
    } = this.props;
    const { loadExample } = this.state;

    return (
      <div>
        <h1>App component</h1>
        <hr />
        <Button
          primary
          onClick={() => actions.inc()}>
          Increment
        </Button>
        &mdash;
        {incValue}
        <hr />
        <Button
          size="small"
          onClick={this.lazyLoadExample}>
          Load example component
        </Button>
        <hr />
        {loadExample && (
          <Example
            path="shared-components/example"
            />
        )}
      </div>
    );
  }
}


const mapStateToProps = (state) => ({
  fetchTimestamp: getFetchTimestamp(state),
  incValue: getInc(state),
});


const connectedComponent = connect(
  mapStateToProps,
  { inc },
  (stateProps, dispatchProps, ownProps) =>
    Object.assign({}, ownProps, stateProps, {actions: dispatchProps})
)(App);


export default connectedComponent;
