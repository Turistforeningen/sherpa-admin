import React from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/es/integration/react'
import { ConnectedRouter } from 'react-router-redux'

import App from './App.jsx'


const Root = ({ persistor, store, history }) => (
  <PersistGate
    persistor={persistor}
    loading={<h1>PERSISTGATE LOADING</h1>}
  >
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <App />
      </ConnectedRouter>
    </Provider>
  </PersistGate>
)


export default Root
