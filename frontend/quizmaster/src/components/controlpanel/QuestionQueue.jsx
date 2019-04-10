import React from 'react';
import Item from '../General/Item';

export default function QuestionQueue(props) {
  const questionQueue = props.questions.map((question, index) => {
    let cssClass = '';
    if (index === props.currentQuestionIndex) cssClass = 'current';
    else if (index < props.currentQuestionIndex) cssClass = 'greyedOut';

    if (index > props.currentQuestionIndex) {
      return (
        <Item
          key={index}
          index={index + 1}
          text={question.question}
          itemClass={cssClass}
          closeHandler={() => props.removeQuestionFromQueue(question._id)}
        />
      );
    } else {
      return <Item key={index} index={index + 1} text={question.question} itemClass={cssClass} />;
    }
  });

  const toggledClass = props.toggled ? 'disabled' : '';

  return (
    <div className={'QuestionQueue ' + toggledClass}>
      <header>
        <h1>Question Queue</h1>
      </header>
      <main>{questionQueue}</main>
    </div>
  );
}
