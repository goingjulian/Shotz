import React from 'react';
import gameStates from '../../definitions/gameStates';

import shot from './shot.png'

export default class Message extends React.Component {

    render() {
        console.log("y", this.props.gameState === gameStates.IN_ROUND)
        let mainMessage, subMessage;
        switch (this.props.gameState) {
            case gameStates.REGISTER:
                mainMessage = `Waiting for players...`;
                subMessage = `Join with key: ${this.props.roomKey}`;
                break;
            case gameStates.CATEGORY_SELECT:
                mainMessage = `The quizmaster is starting a new round`;
                subMessage = `Selecting categories...`
                break;
            case gameStates.IN_ROUND:
                const messages = this.getInRoundMessages();
                mainMessage = messages.mainMessage;
                subMessage = messages.subMessage;
                break;
            default:
                mainMessage = `Unknown gamestate`;
                subMessage = 'Error occured';
        }
        return <div className="message">
            <div className="mainMsg">
                {mainMessage}
            </div>
            <div className="subMsg">
                {subMessage}
            </div>
        </div>
    }

    getInRoundMessages() {
        let mainMessage, subMessage;
        if (this.props.shotzTime) {
            mainMessage = <div>
                Shotz!
            <img src={shot} alt="A Shot Glass" />
            </div>
            subMessage = `${this.props.shotzTime.shotzTeam} must all take a shot`;
        } else if (this.props.showAnswer) {
            mainMessage = `The correct answer is: ${this.props.currentAnswer}`;
            subMessage = `Did you guess the right answer?`
        } else if(this.props.currentQuestion) {
            mainMessage = this.props.currentQuestion;
            subMessage = `Do you know the answer?`
        } else {
            mainMessage = `Waiting for the next question...`;
            subMessage = `Just be patient`;
        }

        return { mainMessage, subMessage };
    }

}