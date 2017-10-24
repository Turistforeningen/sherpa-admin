import * as fetchTypes from 'core/actions/user/fetch'
import * as logoutTypes from 'core/actions/user/logout'


const fetchError = (state = false, action) => {
  switch (action.type) {
    case fetchTypes.FETCH:
    case logoutTypes.LOGOUT:
      return null
    case fetchTypes.SUCCESS:
      return action.payload.error
        ? action.payload.error
        : null
    case fetchTypes.ERROR:
      return 'network error'
    default:
      return state
  }
}


export default fetchError
