import React from 'react';
import * as ReactRedux from 'react-redux'

import './Lobby.scss'
import Team from './Team.jsx'
import { alterTeamAcceptedStatus, clearRejectedTeamsAction } from '../../actions/teamActions';

function Lobby(props) {
    console.log(props.teamList)
    return (
        <div className="lobby">
            <h1>Waiting for teams</h1>
            <h2>Room key: <span className="highlight">{props.roomKey}</span></h2>
            <h2><span className="highlight">{props.teamList.filter(team => team.accepted).length}</span> teams joined</h2>
            <div className="teamsContainer">
                {
                    props.teamList.map(team =>
                        <Team
                            team={team}
                            key={team.teamName}
                            roomKey={props.roomKey}
                            onAccept={props.acceptTeamAction}
                            onReject={props.rejectTeamAction} />
                    )
                }
            </div>
            <button
                disabled={props.teamList.filter(team => team.accepted === true).length < 2}
                onClick={() => {
                    props.clearRejectedTeamsAction(props.roomKey);
                    // props.categorySelectViewAction();
                }}>Start quiz</button>
            <button onClick={props.loginViewAction}>This should be close</button>
        </div>
    )
}

function mapStateToProps(state) {
    return {
        // teamList: state.lobby.teamList,
        // roomKey: state.room.roomKey
        teamList: state.teams.teamList,
        roomKey: state.room.roomKey
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //loginViewAction: () => dispatch(loginViewAction()),
        // categorySelectViewAction: () => dispatch(categorySelectViewAction()),
        acceptTeamAction: (roomKey, sessionId) => dispatch(alterTeamAcceptedStatus(roomKey, sessionId, true)),
        rejectTeamAction: (roomKey, sessionId) => dispatch(alterTeamAcceptedStatus(roomKey, sessionId, false)),
        clearRejectedTeamsAction: (roomKey) => dispatch(clearRejectedTeamsAction(roomKey))
    }
}

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(Lobby)