import * as fetchTypes from 'core/actions/user/fetch'
import * as logoutTypes from 'core/actions/user/logout'


const fetching = (state = false, action) => {
  switch (action.type) {
    case fetchTypes.FETCH:
      return true
    case fetchTypes.SUCCESS:
    case fetchTypes.ERROR:
    case logoutTypes.LOGOUT:
      return false
    default:
      return state
  }
}


export default fetching
