const { combineReducers } = require('redux');

// Import core third-party reducers here, e.g.:
// const {reducer: formReducer} = require('redux-form')


const configureReducers = (reducers) => combineReducers({
  ...reducers,

  // Combine core third-party reducers here, e.g.:
  // form: formReducer
});


export default configureReducers;
