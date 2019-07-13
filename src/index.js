'use strict';

import 'bootstrap';
import 'datatables.net-bs4';
import './scss/style.scss'

import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import store from './store/index';

import App from './containers/App'

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);
