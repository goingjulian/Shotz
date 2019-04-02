import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';
import * as Redux from 'redux';
import * as ReactRedux from 'react-redux';
import thunkMiddleware from 'redux-thunk'
import { mainReducer } from './reducers/mainReducer';
import environment from './environments/environment'
import { addTeam } from './actions/lobbyActions'

const store = Redux.createStore(
    mainReducer,
    Redux.applyMiddleware(thunkMiddleware)
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

store.dispatch(initSocket());

function initSocket() {
    return async dispatch => {
        const socket = await new WebSocket(`ws://${environment.baseUrl}/ws`)

        socket.onopen = () => console.log("socket connected")

        socket.onmessage = (eventInfo) => {
            const parsedMessage = JSON.parse(eventInfo.data)

            console.log("websocket message received ", parsedMessage)

            if (parsedMessage.type) {
                switch (parsedMessage.type) {
                    case "addTeam":
                        console.log("Adding a team")
                        dispatch(addTeam(parsedMessage.id, parsedMessage.name))
                        break
                    default:
                        console.log("Unknown message");
                }
            }  
        }
    }
}