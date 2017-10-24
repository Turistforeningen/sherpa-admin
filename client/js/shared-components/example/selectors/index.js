
export const isRehydrationDone = (state) =>
  state['shared-components/example'].rehydrationDone


export const getNumber = (state) =>
  state['shared-components/example'].persisted.number


export const getLastActionTimestamp = (state) =>
  state['shared-components/example'].lastActionTimestamp
