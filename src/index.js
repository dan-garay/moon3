import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import { Provider as ReduxProvider } from 'react-redux'
import createStore from './createReduxStore'
import SendOneLamportToRandomAddress from './WalletBalance';
import reportWebVitals from './reportWebVitals';

const store = createStore()


ReactDOM.render(
  <React.StrictMode>
    <ReduxProvider store={store}>
    <App />
    <SendOneLamportToRandomAddress />
    </ReduxProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
