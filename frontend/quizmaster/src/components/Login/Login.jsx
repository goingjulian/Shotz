import React from "react";
import * as ReactRedux from "react-redux";
import { createRoom } from "../../actions/roomActions";

import "./Login.scss";

function Login(props) {
    return (
        <div className="Component Login">
            <nav>
                <div className="navInner">
                    <div className="navMiddle">
                        <h2>Quizmaster</h2>
                    </div>
                </div>
            </nav>
            <main>
                <h1>Shotz: Quizmaster</h1>
                <div className="startContainer">
                    <button className="bttn createRoomBttn" onClick={props.createRoom}>
                        Create a new room!
                    </button>
                    <a href="/">or join a game!</a>
                </div>
            </main>
        </div>
    );
}

function mapStateToProps(props) {
    return {};
}

function mapDispatchToProps(dispatch) {
    return {
        createRoom: () => dispatch(createRoom())
    };
}

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(Login);
