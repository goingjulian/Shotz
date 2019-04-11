import React from 'react';
import * as ReactRedux from 'react-redux';
import './Game.scss';
import { joinRoom } from './../../actions/gameActions';
import Item from '../General/Item.jsx';
import Message from './Message';
import Navigation from '../Navigation/Navigation';

function Game(props) {
  return (
    <div className='Component Game'>
      <Navigation />
      <main>
        <Message
          gameState={props.gameState}
          roomKey={props.roomKey}
          currentQuestion={props.currentQuestion}
          revealAnswer={props.revealAnswer}
        />

        <div className='teams'>
          {props.teams.map(team => {
            return <Item key={team._id} text={`${team.teamName}`} itemClass={`team`} />;
          })}
        </div>
      </main>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    roomKey: state.game.roomKey,
    gameState: state.game.gameState,
    currentRound: state.game.currentRound,
    currentQuestionIndex: state.game.currentQuestionIndex,
    currentQuestion: state.game.currentQuestion,
    teams: state.game.teams,
    revealAnswer: state.game.revealAnswer
  };
}

function mapDispatchToProps(dispatch) {
  return {
    joinRoom: roomKey => dispatch(joinRoom(roomKey))
  };
}

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(Game);
