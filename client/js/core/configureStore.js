import { createStore, applyMiddleware, compose } from 'redux'
import { routerMiddleware } from 'react-router-redux'
import createHistory from 'history/createBrowserHistory'
import { persistStore } from 'redux-persist'
import storage from 'redux-persist/es/storage'
import getStoredState from 'redux-persist/es/getStoredState'
import { REHYDRATE } from 'redux-persist/es/constants'
import thunk from 'redux-thunk'
import log from 'lib/log'

import configureReducers from './configureReducers'
import coreReducer from './reducers/index.js'
import { REHYDRATION_DONE } from './actions/rehydrationDone'


const history = createHistory()
const middlewares = [thunk, routerMiddleware(history)]
if (process.env.NODE_ENV !== 'production') {
  const { createLogger } = require('redux-logger')
  middlewares.push(createLogger())
}

const createStoreWithMiddleware = compose(
  applyMiddleware(...middlewares)
)(createStore)


const configureStore = (reducerRegistry) => {
  const rootReducer = configureReducers(reducerRegistry.getReducers())
  const store = createStoreWithMiddleware(rootReducer)
  const persistor = persistStore(store)
  store.reducerRegistry = reducerRegistry

  // Reconfigure the store's reducer when the reducer registry is changed - we
  // depend on this for loading reducers via code splitting and for hot
  // reloading reducer modules.
  reducerRegistry.setChangeListener((reducers) => {
    const newRootReducer = configureReducers(reducers)
    store.replaceReducer(newRootReducer)
    persistor.persist()
  })

  // Configure hot module replacement for core reducers
  // TODO(Roar): Some weird bug with either the app's HMR-config or the
  // HMR-implementation forces us to register a listner for changes to the
  // core reducers both in this file (configureStore.js) and in render.js.
  if (process.env.NODE_ENV !== 'production') {
    if (module.hot) {
      module.hot.accept('./reducers', () => {})
    }
  }

  return { persistor, store, history }
}


export default configureStore
