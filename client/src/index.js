import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { ToastProvider } from 'react-toast-notifications';
import App from './App';
import {Provider} from "react-redux";
import store from "./store"
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <Provider store={store}>
    <ToastProvider
      autoDismiss={true}
      autoDismissTimeout={4000}      
      placement="top-right"
    >
      <App />
    </ToastProvider>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
