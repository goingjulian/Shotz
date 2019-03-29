import React from "react";
import * as ReactRedux from "react-redux";
import './Lobby.scss';

class Lobby extends React.Component {
  render() {
    return (
      <div className="Lobby">
        <header>
          <h1>Are you ready for Shotz?</h1>
        </header>
        <main>
          <div className="inputField">
            <label htmlFor="roomCode">Room code:</label>
            <input name="roomCode" placeholder='Room code' />
          </div>
          <div className="inputField">
            <label htmlFor="teanName">Team name:</label>
            <input name="teanName" placeholder='Team name' />
          </div>
          <div className='inputField'>
            <button>Join quizz</button>
          </div>
        </main>
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

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(Lobby);
