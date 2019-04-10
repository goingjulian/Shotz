import React from "react";
import * as ReactRedux from "react-redux";
import Navigation from '../Navigation/Navigation';

import "./EndRound.scss";

class EndRound extends React.Component {
  getSortedTeams() {
    return this.props.teams.slice().sort((a, b) => {
      if (a.score > b.score) return -1
      if (a.score < b.score) return 1
      return 0
    });
  }

  render() {
    return (
      <div className="Component EndRound">
        <Navigation />
        <main>
          <h1 className="endRoundMsg">End round {this.props.currentRound}</h1>
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
        </main>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    roomKey: state.game.roomKey,
    currentRound: state.game.currentRound,
    teams: state.game.teams
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(EndRound);
