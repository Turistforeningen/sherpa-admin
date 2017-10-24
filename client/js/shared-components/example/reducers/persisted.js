import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/es/storage'

import number from './number'


const persistConfig = {
  key: 'shared-components/example',
  version: '1',
  storage,
}


const rootReducer = combineReducers({
  number,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)


export default persistedReducer
