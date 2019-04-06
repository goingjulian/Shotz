import React from "react";
import * as ReactRedux from "react-redux";

import "./Question.scss";
import { leaveGame } from "../../actions/gameActions";

function Question(props) {
    return (
        <div className="Component Question">
            <nav>
                <div className="navInner">
                    <div className="navCloseGame">
                        <button onClick={() => this.props.leaveGame(props.roomKey)}>Leave</button>
                    </div>
                    <div className="navTeamName">
                        <span>Team: {props.teamName}</span>
                    </div>
                    <div className="navRoomKey">
                        <span>Room: {props.roomKey}</span>
                    </div>
                </div>
            </nav>
            <main>
                <h1 className="question">{props.question.question}</h1>
                <h2 className="category">{props.question.category}</h2>
                <div className="inputField">
                    <label htmlFor="answer">Answer:</label>
                    <input
                        onChange={e => this.handleInput(e)}
                        id="answer"
                        name="answer"
                        placeholder="Your answer"
                        autoComplete="off"
                    />
                </div>
                <div className="inputField">
                    <button onClick={(e) => this.submitForm(e)}>Submit</button>
                </div>
            </main>
        </div>
    );
}

function mapStateToProps(state) {
    return {
        roomKey: state.game.roomKey,
        teamName: state.game.teamName,
        question: state.game.question
    };
}

function mapDispatchToProps(dispatch) {
    return {
        leaveGame: roomKey => dispatch(leaveGame(roomKey))
    };
}

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(Question);
