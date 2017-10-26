import { connect } from 'react-redux'


export default (mapStateToProps = {}, actions = {}) => connect(
  mapStateToProps,
  actions,
  (stateProps, dispatchProps, ownProps) =>
    Object.assign({}, ownProps, stateProps, {actions: dispatchProps})
)
