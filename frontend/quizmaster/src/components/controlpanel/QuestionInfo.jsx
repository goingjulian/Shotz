import React from 'react';
import * as ReactRedux from 'react-redux';

class QuestionInfo extends React.Component {
  render() {
    return (
      <div className="QuestionInfo">
        <p>Test</p>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(QuestionInfo);