import React from 'react';
import gameStates from '../../definitions/gameStates';

import shot from './shot.png';

export default class Message extends React.Component {
  render() {
    let mainMessage, subMessage;
    switch (this.props.gameState) {
      case gameStates.REGISTER:
        mainMessage = `Waiting for players...`;
        subMessage = `Join with key: ${this.props.roomKey}`;
        break;
      case gameStates.CATEGORY_SELECT:
        mainMessage = `The quizmaster is starting a new round`;
        subMessage = `Selecting categories...`;
        break;
      case gameStates.IN_ROUND:
      case gameStates.SUBMIT_CLOSED:
        const messages = this.getInRoundMessages();
        mainMessage = messages.mainMessage;
        subMessage = messages.subMessage;
        break;
      default:
        mainMessage = `Oops, something went wrong`;
        subMessage = 'Error occured';
    }
    return (
      <div className='question'>
        <h2>{subMessage}</h2>
        <h1>{mainMessage}</h1>
      </div>
    );
  }

  getInRoundMessages() {
    let mainMessage, subMessage;
    if (this.props.shotzTime) {
      mainMessage = (
        <div>
          Shotz!
          <img src={shot} alt='A Shot Glass' />
        </div>
      );
      subMessage = `${this.props.shotzTime.shotzTeam} must all take a shot`;
    } else if (this.props.revealAnswer) {
      mainMessage = `The correct answer is: ${this.props.currentQuestion.answer}`;
      subMessage = `Did you guess the right answer?`;
    } else if (this.props.currentQuestion) {
      mainMessage = this.props.currentQuestion.question;
      subMessage = this.props.currentQuestion.category;
    } else {
      mainMessage = `Waiting for the next question...`;
      subMessage = ``;
    }

    return { mainMessage, subMessage };
  }
}
