import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';
import * as Redux from 'redux';
import * as ReactRedux from 'react-redux';
import thunkMiddleware from 'redux-thunk'
import  {mainReducer}  from './reducers/mainReducer';

const store = Redux.createStore(
    mainReducer,
    composeEnhancers(Redux.applyMiddleware(thunkMiddleware))
)

const RootComponent = (
    <ReactRedux.Provider store={store}>
        <App />
    </ReactRedux.Provider>
)

ReactDOM.render(RootComponent, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
