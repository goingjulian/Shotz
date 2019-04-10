import React from 'react';
import * as reactRedux from 'react-redux';
import gameStates from '../../definitions/gameStates';

import './Navigation.scss'

function Navigation(props) {
    return <nav>
        <div className="navInner">
            <div className="navLeft">
                <button>Leave</button>
            </div>

            {props.gameState === gameStates.REGISTER
                ? <div className="navMiddle"><h2>RoomKey: {props.roomKey}</h2></div>
                : <div className="navMiddle">
                    <h2>Question {props.currentQuestionIndex + 1}/12</h2>
                    <h2>Round {props.currentRound}</h2>
                </div>
            }

            <div className="navRight">
                <span>{props.teams.length} {props.teams.length === 1 ? "team" : "teams"} connected</span>
            </div>

        </div>
    </nav>
}

function mapStateToProps(state) {
    return {
        gameState: state.game.gameState,
        roomKey: state.game.roomKey,
        currentQuestionIndex: state.game.currentQuestionIndex,
        currentRound: state.game.currentRound,
        teams: state.game.teams
    }
}

export default reactRedux.connect(mapStateToProps)(Navigation);