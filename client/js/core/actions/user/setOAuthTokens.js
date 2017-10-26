
export const SET = 'app/core/user/OAuthTokens/SET'


const setOAuthTokens = (payload) => ({
  type: SET,
  payload,
})


export default setOAuthTokens
