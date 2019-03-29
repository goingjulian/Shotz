import React from "react";
import Item from './../General/Item';

export default function QuestionQueue(props) {
  const questions = [
    "1 + 1 = ?",
    "Wat is de hoofdstad van Parijs?",
    "Hoe heet een mannelijke eend?",
    "4 + 4 = ?"
  ];
  const questionQueue = questions.map((question, index) => (
    <Item key={index} index={index} text={question} />
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
