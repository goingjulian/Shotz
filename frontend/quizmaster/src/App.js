import React from 'react';
import './App.scss';
import * as ReactRedux from 'react-redux';
import ControlPanel from './components/controlpanel/ControlPanel';


function App(props) {
  return (
    <div className="App">
      {/* <props.activeView /> */}
      <ControlPanel></ControlPanel>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    activeView: state.activeView
  }
}

export default ReactRedux.connect(mapStateToProps)(App);
