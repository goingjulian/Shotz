import React from "react";
import * as ReactRedux from "react-redux";

import "./Lobby.scss";
import { alterTeamAcceptedStatus, clearRejectedTeams } from "../../actions/teamActions";
import { leaveRoom } from "../../actions/roomActions";
import Item from "../General/Item";
import Navigation from "../Navigation/Navigation";

function getItemClass(accepted) {
  return accepted ? "lobbyTeamListItem accepted" : "lobbyTeamListItem";
}

function Lobby(props) {
  const startNotAllowed = props.teamList.filter(team => team.accepted === true).length < 2;
  return (
    <div className="Component Lobby">
      <Navigation />
      <main>
        <h1>{props.teamList.length} teams joined:</h1>
        <div className="lobbyTeamList">
          {props.teamList.map((team, index) => (
            <Item
              key={index + 1}
              index={index + 1}
              text={team.teamName}
              acceptHandler={() => props.acceptTeamAction(props.roomKey, team.sessionId)}
              closeHandler={() => props.rejectTeamAction(props.roomKey, team.sessionId)}
              itemClass={getItemClass(team.accepted)}
            />
          ))}
          {props.teamList.length < 1 && <span className="lobbyTeamListNoTeams">There are no teams!</span>}
        </div>
        <div className="lobbyStartQuizContainer">
          <button
            className={startNotAllowed ? "bttn disabled" : "bttn"}
            disabled={startNotAllowed}
            onClick={() => {
              props.clearRejectedTeamsAction(props.roomKey);
            }}
          >
            Start quiz
          </button>
        </div>
      </main>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    teamList: state.teams.teamList,
    roomKey: state.room.roomKey
  };
}

function mapDispatchToProps(dispatch) {
  return {
    leaveRoomAction: roomKey => dispatch(leaveRoom(roomKey)),
    acceptTeamAction: (roomKey, sessionId) => dispatch(alterTeamAcceptedStatus(roomKey, sessionId, true)),
    rejectTeamAction: (roomKey, sessionId) => dispatch(alterTeamAcceptedStatus(roomKey, sessionId, false)),
    clearRejectedTeamsAction: roomKey => dispatch(clearRejectedTeams(roomKey))
  };
}

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(Lobby);
