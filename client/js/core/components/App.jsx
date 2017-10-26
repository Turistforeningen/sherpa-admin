import React, { Component } from 'react'
import { autobind } from 'core-decorators'
import universal from 'react-universal-component'
import universalOptions from 'core/universalOptions'
import { replace as routerReplace } from 'react-router-redux'
import connect from 'lib/wrappedConnect'
import log from 'lib/log'

import inc from 'core/actions/user/inc'
import { getPath, getQueryParams } from 'core/selectors/router'
import { getFetchTimestamp, getInc } from 'core/selectors/user'
import setOAuthTokens from 'core/actions/user/setOAuthTokens'

import { Route } from 'react-router'
import { Link } from 'react-router-dom'
import { Button } from 'semantic-ui-react'
import Dashboard from 'modules/dashboard'
import Users from 'modules/users'


const Example = universal(
  () => import('shared-components/example'),
  {
    ...universalOptions,
    resolve: (props) => require.resolveWeak('shared-components/example'),
  }
)


class App extends Component {
  constructor(props) {
    super(props)

    this.state = { loadExample: false }
  }

  componentWillMount() {
    const { actions, path, queryParams } = this.props

    // Set OAuthTokens defined from server
    const { OAuthTokens } = (window.sherpa || {})
    if (OAuthTokens) {
      actions.setOAuthTokens(OAuthTokens)
    }

    // If on an OAuth path (/o/verify/) redirect to `next` or dashboard
    if (path.startsWith('/o/')) {
      const nextPath = `/${queryParams.next || ''}`
      actions.routerReplace(nextPath)
    }
  }

  @autobind
  lazyLoadExample() {
    this.setState({ loadExample: !this.state.loadExample })
  }

  render() {
    const {
      persistor,
      actions,
      incValue,
      fetchTimestamp,
    } = this.props
    const { loadExample } = this.state

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
          <Example />
        )}

        <hr />

        <div>
          <Link to="/">Hjem</Link>{' '}
          <Link to="/users">Brukere</Link>{' '}
          <Link to="/example">Example</Link>{' '}
        </div>

        <div>
          <Route exact path="/" component={Dashboard}/>
          <Route path="/users" component={Users}/>
          <Route path="/example" component={Example}/>
        </div>
      </div>
    )
  }
}


const mapStateToProps = (state) => ({
  fetchTimestamp: getFetchTimestamp(state),
  incValue: getInc(state),
  path: getPath(state),
  queryParams: getQueryParams(state),
})


const ConnectedComponent = connect(
  mapStateToProps,
  { inc, setOAuthTokens, routerReplace }
)(App)


export default ConnectedComponent
