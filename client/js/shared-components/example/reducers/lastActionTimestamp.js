import { INCREMENT } from '../actions/increment'
import { DECREMENT } from '../actions/decrement'


const lastActionTimestamp = (state = null, action) => {
  switch (action.type) {
    case INCREMENT:
    case DECREMENT:
      return new Date()
    default:
      return state
  }
}


export default lastActionTimestamp
