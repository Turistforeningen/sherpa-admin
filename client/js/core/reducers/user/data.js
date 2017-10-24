import * as fetchTypes from 'core/actions/user/fetch'
import * as logoutTypes from 'core/actions/user/logout'


const data = (state = {}, action) => {
  switch (action.type) {
    case fetchTypes.SUCCESS:
      return action.payload.user
        ? action.payload.user
        : state
    case logoutTypes.LOGOUT:
      return {}
    default:
      return state
  }
}


export default data
