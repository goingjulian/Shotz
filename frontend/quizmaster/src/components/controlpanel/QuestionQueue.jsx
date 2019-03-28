import React from "react";

export default function QuestionQueue(props) {
  const questions = ["1 + 1 = ?", "Wat is de hoofdstad van Parijs?", "Hoe heet een mannelijke eend?", "4 + 4 = ?"];
  const questionQueue = questions.map((question, index) => (
    <QuestionItem key={index} index={index} question={question} />
  ));

  return (
    <div className="QuestionQueue">
      <header>
        <h1>Question Queue</h1>
      </header>
      <main>{questionQueue}</main>
    </div>
  );
}

function QuestionItem(props) {
  return (
    <div className="questionItem">
      <span className="itemIndex">{props.index}.</span>
      <span className="itemText">{props.question}</span>
    </div>
  );
}
