
export const isFetching = (state) => state['core/user'].fetching


export const getFetchError = (state) => state['core/user'].fetchError


export const getFetchTimestamp = (state) => state['core/user'].fetchTimestamp


export const getData = (state) => state['core/user'].data


export const getInc = (state) => state['core/user'].persisted.inc
