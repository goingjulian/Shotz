import React from "react";
import * as ReactRedux from "react-redux";
import Item from "../General/Item";

class QuestionInfo extends React.Component {
  render() {
    const answers = [
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
    const answerItems = answers.map((answer, index) => (
      <Item
        key={index}
        text={answer.answer}
        team={answer.team}
        itemClass="AnswerItem"
        closeHandler={() => {}}
        acceptHandler={() => {}}
      />
    ));
    return (
      <div className="QuestionInfo">
        <div className="infoActions">
          <h2>Round 1</h2>
        </div>
        <div className="infoQuestion">
          <h2>
            Question 1/12: <span>What's the capital of Paris?</span>
          </h2>
          <h2>
            Answer: <span>Don't do drugs kids.</span>
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
  return {};
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(
  QuestionInfo
);
