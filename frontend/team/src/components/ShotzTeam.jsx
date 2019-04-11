import React from 'react';
import * as ReactRedux from 'react-redux';

function ShotzTeam(props) {
  return <props.activeView />;
}

function mapStateToProps(state) {
  return {
    activeView: state.views.activeView
  };
}

export default ReactRedux.connect(mapStateToProps)(ShotzTeam);
