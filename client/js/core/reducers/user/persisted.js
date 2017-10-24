import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/es/storage';

import inc from './inc';


const persistConfig = {
  key: 'core/user',
  version: '1',
  storage,
};


const rootReducer = combineReducers({
  inc,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);


export default persistedReducer;
