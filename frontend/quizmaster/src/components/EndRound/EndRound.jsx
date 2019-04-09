import React from "react";
import * as ReactRedux from "react-redux";

import "./EndRound.scss";

import Navigation from "../Navigation/Navigation";
import { setCategorySelectState } from "../../actions/viewActions";

class EndRound extends React.Component {
  getSortedTeams() {
    return this.props.teams.slice().sort((a, b) => {
      if(a.score > b.score) return -1
      if(a.score < b.score) return 1
      return 0
    });
  }

  render() {
    return (
      <div className="Component EndRound">
        <Navigation />
        <main>
          <h1>End round {this.props.currentRound}</h1>
          <ul>
            {this.getSortedTeams().map((team, index) => {
              return (
                <li key={index}>
                  <span className="position">{index + 1}.</span>
                  <span>
                    {team.teamName}
                  </span>
                  <span className='score'>{team.score} points</span>
                </li>
              );
            })}
          </ul>
          <button className="bttn" onClick={() => this.props.setCategorySelectState(this.props.roomKey)}>
            Start new round
          </button>
        </main>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    roomKey: state.room.roomKey,
    currentRound: state.rounds.rounds.length,
    teams: state.teams.teamList
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setCategorySelectState: roomKey => dispatch(setCategorySelectState(roomKey))
  };
}

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(EndRound);
