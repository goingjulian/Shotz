import React from "react";
import * as ReactRedux from "react-redux";
import Item from "../General/Item";

class QuestionInfo extends React.Component {
  render() {

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
          <h2>Round {this.props.rounds.currentRoundIndex + 1}</h2>
          <button>Next question</button>
        </div>
        <div className="infoQuestion">
          <h2>
            Question {this.props.rounds.currentQuestionIndex + 1}/{this.props.rounds.currentRound.questions.length + 1}:
            <span> {this.props.rounds.currentQuestion}</span>
          </h2>
          <h2>
            Answer: <span>{this.props.rounds.currentAnswer}</span>
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
    rounds: state.rounds.rounds
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(
  QuestionInfo
);
