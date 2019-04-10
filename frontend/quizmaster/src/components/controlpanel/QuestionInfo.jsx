import React from 'react';
import * as ReactRedux from 'react-redux';
import Item from '../General/Item';
import { setAnswerStatus } from '../../actions/teamActions';
import { nextQuestion, endRound, revealAnswer } from '../../actions/roundsActions';

class QuestionInfo extends React.Component {
  handleAnswerStatus(questionId, teamSessionId, correct) {
    this.props.setAnswerStatus(this.props.roomKey, questionId, teamSessionId, correct);
  }

  render() {
    const currentQuestionObj = this.props.currentRound.questions[this.props.activeQuestionIndex];
    const totalQuestionsAmount = this.props.currentRound.questions.length;
    const currentQuestion = currentQuestionObj.question;
    const currentAnswer = this.props.currentRound.questions[this.props.activeQuestionIndex].answer;

    const answers = [];

    this.props.teamList.forEach(team => {
      const answer = team.answers.find(answer => answer.questionId === currentQuestionObj._id);

      if (answer) {
        let answerClass;
        if (answer.correct) answerClass = 'correct';
        else if (answer.correct === false) answerClass = 'incorrect';

        answers.push(
          <Item
            key={team.teamName}
            text={answer.answer}
            team={team.teamName}
            itemClass={`itemAnswer ${answerClass}`}
            closeHandler={() => {
              this.props.setAnswerStatus(
                this.props.roomKey,
                answer.questionId,
                team.sessionId,
                false
              );
            }}
            acceptHandler={() => {
              this.props.setAnswerStatus(
                this.props.roomKey,
                answer.questionId,
                team.sessionId,
                true
              );
            }}
          />
        );
      }
    });

    return (
      <div className='QuestionInfo'>
        <div className='infoActions'>
          {!this.props.answerRevealed ? (
            <button className='bttn' onClick={() => this.props.revealAnswer(this.props.roomKey)}>
              Show answer to teams
            </button>
          ) : null}
          <h2>Round {this.props.rounds.length}</h2>
          {totalQuestionsAmount === this.props.activeQuestionIndex + 1 ? (
            <button className='bttn' onClick={() => this.props.endRound(this.props.roomKey)}>
              End round
            </button>
          ) : (
            <button className='bttn' onClick={() => this.props.nextQuestion(this.props.roomKey)}>
              Next question
            </button>
          )}
        </div>
        <div className='infoQuestion'>
          <h2>
            Question {this.props.activeQuestionIndex + 1}/{totalQuestionsAmount}:
            <span> {currentQuestion}</span>
          </h2>
          <h2>
            Answer: <span>{currentAnswer}</span>
          </h2>
          <h2>
            Answers ({answers.length}/{this.props.teamList.length}):
          </h2>
          <div className='infoAnswersList'>{answers}</div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  console.log(state);
  return {
    roomKey: state.room.roomKey,
    rounds: state.rounds.rounds,
    activeQuestionIndex: state.rounds.rounds[state.rounds.rounds.length - 1].activeQuestionIndex,
    currentRound: state.rounds.rounds[state.rounds.rounds.length - 1],
    teamList: state.teams.teamList,
    answerRevealed: state.rounds.answerRevealed
  };
}

function mapDispatchToProps(dispatch) {
  return {
    nextQuestion: roomKey => dispatch(nextQuestion(roomKey)),
    setAnswerStatus: (roomKey, questionId, teamSessionId, correct) =>
      dispatch(setAnswerStatus(roomKey, questionId, teamSessionId, correct)),
    endRound: roomKey => dispatch(endRound(roomKey)),
    revealAnswer: roomKey => dispatch(revealAnswer(roomKey))
  };
}

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(QuestionInfo);
