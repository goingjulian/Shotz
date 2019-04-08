import React from "react";
import Item from '../General/Item';

export default function QuestionQueue(props) {
  const questionQueue = props.questions.map((question, index) => {
    let cssClass = ""
    if (index === props.currentQuestionIndex) cssClass = "current"
    else if (index < props.currentQuestionIndex) cssClass = "greyedOut"

    return <Item key={index} index={index + 1} text={question.question} itemClass={cssClass}/>
  }

  );

  return (
    <div className="QuestionQueue">
      <header>
        <h1>Question Queue</h1>
      </header>
      <main>{questionQueue}</main>
    </div>
  );
}
