import React, { Component } from 'react'
import { connect } from 'react-redux'

import { isRehydrationDone } from '../selectors'

import Example from './Example.jsx'


class Root extends Component {
  render() {
    const { rehydrationDone } = this.props

    if (!rehydrationDone) {
      return <h2>REHYDRATING EXAMPLE COMPONENT</h2>
    }

    return (
      <Example />
    )
  }
}


const mapStateToProps = (state) => ({
  rehydrationDone: isRehydrationDone(state),
})


const connectedComponent = connect(mapStateToProps)(Root)

export default connectedComponent
