import React from "react";
import * as ReactRedux from "react-redux";

import "./Lobby.scss";
import { alterTeamAcceptedStatus, clearRejectedTeams } from "../../actions/teamActions";
import Item from "../General/Item";
import Navigation from "../Navigation/Navigation";
import { setCategorySelectState } from "../../actions/viewActions";

class Lobby extends React.Component {
  getItemClass(accepted) {
    return accepted ? "lobbyTeamListItem accepted" : "lobbyTeamListItem";
  }

  startGame() {
    this.props.clearRejectedTeams(this.props.roomKey);
    this.props.setCategorySelectState(this.props.roomKey);
  }

  render() {
    return (
      <div className="Component Lobby">
        <Navigation />
        <main>
          <h1>{this.props.teamList.length} teams joined:</h1>
          <div className="lobbyTeamList">
            {this.props.teamList.map((team, index) => (
              <Item
                key={index + 1}
                index={index + 1}
                text={team.teamName}
                acceptHandler={() => this.props.acceptTeamAction(this.props.roomKey, team.sessionId)}
                closeHandler={() => this.props.rejectTeamAction(this.props.roomKey, team.sessionId)}
                itemClass={this.getItemClass(team.accepted)}
              />
            ))}
            {this.props.teamList.length < 1 && <span className="lobbyTeamListNoTeams">There are no teams!</span>}
          </div>
          <div className="lobbyStartQuizContainer">
            {this.props.teamList.filter(team => team.accepted).length >= 2 && (
              <button className="bttn" onClick={() => this.startGame()}>
                Start quiz
              </button>
            )}
          </div>
        </main>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    teamList: state.teams.teamList,
    roomKey: state.room.roomKey
  };
}

function mapDispatchToProps(dispatch) {
  return {
    acceptTeamAction: (roomKey, sessionId) => dispatch(alterTeamAcceptedStatus(roomKey, sessionId, true)),
    rejectTeamAction: (roomKey, sessionId) => dispatch(alterTeamAcceptedStatus(roomKey, sessionId, false)),
    clearRejectedTeams: roomKey => dispatch(clearRejectedTeams(roomKey)),
    setCategorySelectState: roomKey => dispatch(setCategorySelectState(roomKey))
  };
}

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(Lobby);
