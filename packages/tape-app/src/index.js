import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import tapeApp from './reducers';
import App from './components/App';

const store = createStore(tapeApp, {tapeSpeed: 10, feedbackAmount: 10});

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
