import api from 'core/api'


export const FETCH = 'app/core/user/fetch/FETCH'
export const SUCCESS = 'app/core/user/fetch/SUCCESS'
export const ERROR = 'app/core/user/fetch/ERROR'


const fetch = () => (dispatch, getState) => {
  // if (getIsPending(getState())) {
  //   return Promise.resolve();
  // }

  dispatch({type: FETCH})

  const opts = {
    url: '/api/v3/users/me',
    method: 'GET',
  }

  return api(opts).then(
    (response) => {
      dispatch({
        type: SUCCESS,
        payload: response,
      })
    },
    (error) => {
      dispatch({
        type: ERROR,
        message: error.message || 'unknown error',
      })
    }
  )
}


export default fetch
