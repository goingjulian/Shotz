import React from "react";
import * as ReactRedux from "react-redux";

import "./Lobby.scss";
import { alterTeamAcceptedStatus, clearRejectedTeams } from "../../actions/teamActions";
import { leaveRoom } from "../../actions/roomActions";
import Item from "../General/Item";

function getItemClass(accepted) {
    return (accepted) ? 'lobbyTeamListItem accepted' : 'lobbyTeamListItem';
}

function Lobby(props) {
    return (
        <div className="Component Lobby">
            <nav>
                <div className="navInner">
                    <div className="navLeft">
                        <button onClick={() => props.leaveRoomAction(props.roomKey)}>Leave</button>
                    </div>
                    <div className="navMiddle">
                        <h2>Room: {props.roomKey}</h2>
                    </div>
                </div>
            </nav>
            <main>
                <h1>{props.teamList.length} teams joined:</h1>
                <div className="lobbyTeamList">
                    {props.teamList.map((team, index) => (
                        <Item 
                            key={index+1}
                            index={index+1}
                            text={team.teamName}
                            acceptHandler={() => props.acceptTeamAction(props.roomKey, team.sessionId)}
                            closeHandler={() => props.rejectTeamAction(props.roomKey, team.sessionId)}
                            itemClass={getItemClass(team.accepted)}
                        />
                     
                    ))}
                    {props.teamList.length < 1 && <span className='lobbyTeamListNoTeams'>There are no teams!</span>}
                </div>
                <div className="lobbyStartQuizContainer">
                    <button className="bttn"
                        disabled={props.teamList.filter(team => team.accepted === true).length < 2}
                        onClick={() => {
                            props.clearRejectedTeamsAction(props.roomKey);
                            // props.categorySelectViewAction();
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
        // teamList: state.lobby.teamList,
        // roomKey: state.room.roomKey
        teamList: state.teams.teamList,
        roomKey: state.room.roomKey
    };
}

function mapDispatchToProps(dispatch) {
    return {
        leaveRoomAction: roomKey => dispatch(leaveRoom(roomKey)),
        //loginViewAction: () => dispatch(loginViewAction()),
        // categorySelectViewAction: () => dispatch(categorySelectViewAction()),
        acceptTeamAction: (roomKey, sessionId) => dispatch(alterTeamAcceptedStatus(roomKey, sessionId, true)),
        rejectTeamAction: (roomKey, sessionId) => dispatch(alterTeamAcceptedStatus(roomKey, sessionId, false)),
        clearRejectedTeamsAction: roomKey => dispatch(clearRejectedTeams(roomKey))
    };
}

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(Lobby);
