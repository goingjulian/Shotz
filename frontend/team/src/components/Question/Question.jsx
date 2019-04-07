import React from "react";
import * as ReactRedux from "react-redux";

import "./Question.scss";
import { leaveGame, submitAnswer } from "../../actions/gameActions";

class Question extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            answer: null
        }
    }

    handleInput(e) {
        this.setState({
            answer: e.target.value
        })

        console.log(this.state);
    }

    submitAnswer(e) {
        e.preventDefault();
        if (this.state.answer === "" || this.state.answer === null) {
            console.log("Vul alle velden in!");
        } else {
            this.props.submitAnswer(this.props.roomKey, this.props.question.questionId, this.state.answer);
        }
    }

    render() {
        return (
            <div className="Component Question">
                <nav>
                    <div className="navInner">
                        <div className="navCloseGame">
                            <button onClick={() => this.props.leaveGame(this.props.roomKey)}>Leave</button>
                        </div>
                        <div className="navTeamName">
                            <span>Team: {this.props.teamName}</span>
                        </div>
                        <div className="navRoomKey">
                            <span>Room: {this.props.roomKey}</span>
                        </div>
                    </div>
                </nav>
                <main>
                    <h1 className="question">{this.props.question.question}</h1>
                    <h2 className="category">{this.props.question.category}</h2>
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
                        <button onClick={(e) => this.submitAnswer(e)}>Submit</button>
                    </div>
                </main>
            </div>
        );
    }

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
        leaveGame: roomKey => dispatch(leaveGame(roomKey)),
        submitAnswer: (roomKey, questionId, answer) => dispatch(submitAnswer(roomKey, questionId, answer))
    };
}

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(Question);
