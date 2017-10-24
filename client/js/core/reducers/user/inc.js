import { INC } from 'core/actions/user/inc'


const inc = (state = 0, action) => {
  switch (action.type) {
    case INC:
      return state + 1
    default:
      return state
  }
}


export default inc
