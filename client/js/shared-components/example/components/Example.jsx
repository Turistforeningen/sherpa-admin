import React, { Component } from 'react'
import { connect, Provider } from 'react-redux'
import { autobind } from 'core-decorators'
import universal from 'react-universal-component'
import log from 'lib/log'

import { getNumber, getLastActionTimestamp } from '../selectors'
import increment from '../actions/increment'
import decrement from '../actions/decrement'

import { Button } from 'semantic-ui-react'


class Example extends Component {
  @autobind
  increment() {
    const { actions } = this.props
    actions.increment()
  }

  @autobind
  decrement() {
    const { actions } = this.props
    actions.decrement()
  }

  render() {
    const { number, lastActionTimestamp } = this.props

    return (
      <div>
        <h3>Example Component is here</h3>
        {<ul>
          <li>Current number: {number || 0}</li>
          <li>
            Last action executed:{' '}
            {(lastActionTimestamp || '').toString() || <em>none this session</em>}
          </li>
        </ul>}

        <Button
          size="small"
          color="green"
          onClick={this.increment}>
          Increment..
        </Button>
        <Button
          size="small"
          color="red"
          onClick={this.decrement}>
          Decrement
        </Button>
      </div>
    )
  }
}


const mapStateToProps = (state) => ({
  number: getNumber(state),
  lastActionTimestamp: getLastActionTimestamp(state),
})


const connectedComponent = connect(
  mapStateToProps,
  { increment, decrement },
  (stateProps, dispatchProps, ownProps) =>
    Object.assign({}, ownProps, stateProps, {actions: dispatchProps})
)(Example)


export default connectedComponent
