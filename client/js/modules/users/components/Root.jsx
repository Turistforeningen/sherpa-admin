import React, { Component } from 'react'
import { connect } from 'react-redux'
import { autobind } from 'core-decorators'


class Root extends Component {
  render() {
    return (
      <div>Users!</div>
    )
  }
}


const mapStateToProps = (state) => ({})


const connectedComponent = connect(
  mapStateToProps,
  {},
  (stateProps, dispatchProps, ownProps) =>
    Object.assign({}, ownProps, stateProps, {actions: dispatchProps})
)(Root)

export default connectedComponent
