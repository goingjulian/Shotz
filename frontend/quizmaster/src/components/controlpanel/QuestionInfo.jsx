import React from "react";
import * as ReactRedux from "react-redux";
import Item from "../General/Item";
import { nextQuestion, endRound } from '../../actions/roundsActions'

class QuestionInfo extends React.Component {
  render() {
    const currentQuestionObj = this.props.currentRound.questions[this.props.activeQuestionIndex];
    const totalQuestionsAmount = this.props.currentRound.questions.length;
    const currentQuestion = currentQuestionObj.question;
    const currentAnswer = this.props.currentRound.questions[this.props.activeQuestionIndex].answer;

    const answers = [];
    this.props.teamList.forEach(team => {
      console.log(team)
      const answer = team.answers.find(answer => answer.questionId === currentQuestionObj._id);
      console.log(answer)
      if (answer) {
        answers.push(<Item
          key={team.teamName}
          text={answer.answer}
          team={team.teamName}
          itemClass="AnswerItem"
          closeHandler={() => { }}
          acceptHandler={() => { }}
        />)
      }
    })

    return (
      <div className="QuestionInfo">
        <div className="infoActions">
          <button>Show answer to teams</button>
          <h2>Round {this.props.rounds.length}</h2>
          {totalQuestionsAmount === this.props.activeQuestionIndex + 1
            ? <button onClick={() => this.props.endRound(this.props.roomKey)}>End round</button>
            : <button onClick={() => this.props.nextQuestion(this.props.roomKey)}>Next question</button>}
        </div>
        <div className="infoQuestion">
          <h2>
            Question {this.props.activeQuestionIndex + 1}/{totalQuestionsAmount}:
            <span> {currentQuestion}</span>
          </h2>
          <h2>
            Answer: <span>{currentAnswer}</span>
          </h2>
        </div>
        <div className="infoAnswers">
          <h2>Answers ({answers.length}/{this.props.teamList.length}):</h2>
          <div className="infoAnswersList">{answers}</div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  console.log(state)
  return {
    roomKey: state.room.roomKey,
    rounds: state.rounds.rounds,
    activeQuestionIndex: state.rounds.rounds[state.rounds.rounds.length - 1].activeQuestionIndex,
    currentRound: state.rounds.rounds[state.rounds.rounds.length - 1],
    teamList: state.teams.teamList
  };
}

function mapDispatchToProps(dispatch) {
  return {
    nextQuestion: (roomKey) => dispatch(nextQuestion(roomKey)),
    endRound: (roomKey) => dispatch(endRound(roomKey))
  };
}

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(
  QuestionInfo
);
