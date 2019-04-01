import React from "react";
import * as ReactRedux from "react-redux";
import "./Lobby.scss";
import { joinRoomAction } from "../../actions/viewActions";

class Lobby extends React.Component {
  constructor() {
    super();
    this.state = {
      roomCode: "",
      teamName: ""
    };
  }

  handleInput(e) {
    const target = e.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  submitForm(e) {
    e.preventDefault();
    if (this.state.roomCode === "" || this.state.teamName === "") {
      console.log("Vul alle velden in!");
    } else {
      this.props.joinRoom(this.state.roomCode, this.state.teamName);
    }
  }

  render() {
    return (
      <div className="Lobby">
        <header>
          <h1>Are you ready for Shotz?</h1>
        </header>
        <main>
          <div className="inputField">
            <label htmlFor="roomCode">Room code:</label>
            <input
              value={this.state.roomCode}
              onChange={e => this.handleInput(e)}
              id="roomCode"
              name="roomCode"
              placeholder="Room code"
            />
          </div>
          <div className="inputField">
            <label htmlFor="teamName">Team name:</label>
            <input
              value={this.state.teamName}
              onChange={e => this.handleInput(e)}
              id="teamName"
              name="teamName"
              placeholder="Team name"
            />
          </div>
          <div className="inputField">
            <button onClick={(e) => this.submitForm(e)}>Join quizz</button>
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
  return {
    joinRoom: (roomKey, teamName) => dispatch(joinRoomAction(roomKey, teamName))
  };
}

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(Lobby);
