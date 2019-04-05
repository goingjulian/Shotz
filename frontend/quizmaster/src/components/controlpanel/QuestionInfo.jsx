import React from "react";
import * as ReactRedux from "react-redux";
import Item from "../General/Item";

class QuestionInfo extends React.Component {
  render() {

    const totalQuestions = this.props.currentRound.questions.length + 1;
    const currentQuestion = this.props.currentRound.questions[this.props.activeQuestionIndex].question;
    const currentAnswer = this.props.currentRound.questions[this.props.activeQuestionIndex].answer;

    const STATICanswers = [
      {
        team: "Fritzzers",
        answer: "Frankrijk?"
      },
      {
        team: "Meronnetjes",
        answer: "Gele hesjes"
      },
      {
        team: "Hardleers",
        answer: "Huh..."
      },
      {
        team: "Da voice",
        answer: "This is the voice of PARIS"
      }
    ];
    const answerItems = STATICanswers.map((answer, index) => (
      <Item
        key={index}
        text={answer.answer}
        team={answer.team}
        itemClass="AnswerItem"
        closeHandler={() => { }}
        acceptHandler={() => { }}
      />
    ));
    return (
      <div className="QuestionInfo">
        <div className="infoActions">
          <button>Show answer to teams</button>
          <h2>Round {this.props.rounds.length}</h2>
          <button>Next question</button>
        </div>
        <div className="infoQuestion">
          <h2>
            Question {this.props.activeQuestionIndex + 1}/{totalQuestions}:
            <span> {currentQuestion}</span>
          </h2>
          <h2>
            Answer: <span>{currentAnswer}</span>
          </h2>
        </div>
        <div className="infoAnswers">
          <h2>Answers (6/8);</h2>
          <div className="infoAnswersList">{answerItems}</div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  console.log(state)
  return {
    rounds: state.rounds.rounds,
    activeQuestionIndex: state.rounds.rounds[state.rounds.rounds.length - 1].activeQuestionIndex,
    currentRound: state.rounds.rounds[state.rounds.rounds.length - 1]
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(
  QuestionInfo
);
