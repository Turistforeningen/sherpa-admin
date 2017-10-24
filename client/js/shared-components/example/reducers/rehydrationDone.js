import { REHYDRATE } from 'redux-persist/es/constants'

const rehydrationDone = (state = false, action) => {
  switch (action.type) {
    case REHYDRATE:
      return true
    default:
      return state
  }
}


export default rehydrationDone
