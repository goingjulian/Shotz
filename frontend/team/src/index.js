import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './assets/scss/style.scss';
import ShotzTeam from './components/ShotzTeam';
import { restoreSession } from './actions/gameActions';
import store from './store';
import Error from './components/Error/Error.jsx';

const RootComponent = (
  <Provider store={store}>
    <ShotzTeam />
    <Error />
  </Provider>
);

store.dispatch(restoreSession());
ReactDOM.render(RootComponent, document.getElementById('root'));
