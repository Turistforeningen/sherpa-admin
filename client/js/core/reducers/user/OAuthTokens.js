import { SET } from 'core/actions/user/setOAuthTokens'


const OAuthTokens = (state = null, action) => {
  switch (action.type) {
    case SET:
      return action.payload
    default:
      return state
  }
}


export default OAuthTokens
