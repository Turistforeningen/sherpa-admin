import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'


const configureReducers = (reducers) => combineReducers({
  ...reducers,

  // Combine core third-party reducers here, e.g.:
  router: routerReducer,
})


export default configureReducers
