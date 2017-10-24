import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';

import App from './App.jsx';


const Root = ({ persistor, store }) => (
  <PersistGate
    persistor={persistor}
    loading={<h1>PERSISTGATE LOADING</h1>}
  >
    <Provider store={store}>
      <App persistor={persistor} />
    </Provider>
  </PersistGate>
);


export default Root;
