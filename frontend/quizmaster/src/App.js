import React from 'react';
import './App.scss';
import * as ReactRedux from 'react-redux';

function App(props) {
  return (
    <div className="App">
      <props.activeView />
    </div>
  );
}

function mapStateToProps(state) {
  return {
    activeView: state.activeView
  }
}

export default ReactRedux.connect(mapStateToProps)(App);
