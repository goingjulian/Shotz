import React from 'react';
import * as ReactRedux from 'react-redux'
import {lobbyViewAction} from '../../actions/viewActions'

import './Login.scss'

function Login(props) {
    return (
        <div className="login">
            <h1>Quizmaster</h1>
            <h2>Start a new quiz</h2>
            <button onClick={props.lobbyViewAction}>Create room</button>
            <button>Participate in a game</button>
        </div>
    );
}

function mapStateToProps(props) {
    return {}
}

function mapDispatchToProps(dispatch) {
    return {
        lobbyViewAction: () => dispatch(lobbyViewAction())
    }
}

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(Login)
