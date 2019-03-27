import React from 'react';
import * as ReactRedux from 'react-redux'
import {createRoomAction} from '../actions/viewActions'

function Login(props) {
    return (
        <div className="login">
            <h1>Quizmaster</h1>
            <h1>Start a new quiz</h1>
            <button onClick={props.createRoom}>Create room</button>
            <button>Participate in a game</button>
        </div>
    );
}

function mapStateToProps(props) {
    return {}
}

function mapDispatchToProps(dispatch) {
    return {
        createRoom: () => dispatch(createRoomAction())
    }
}

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(Login)
