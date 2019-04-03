import React from 'react';
import * as ReactRedux from 'react-redux'

import './Lobby.scss'
import Team from './Team.jsx'
import { rejectTeamAction, acceptTeamAction } from '../../actions/teamActions';

function Lobby(props) {
    return (
        <div className="lobby">
            <h1>Waiting for teams</h1>
            <h2>Room key: <span className="highlight">{props.roomKey}</span></h2>
            <h2><span className="highlight">{props.teamList.filter(team => team.accept).length}</span> teams joined</h2>
            <div className="teamsContainer">
                {
                    props.teamList.map(team =>
                        <Team
                            team={team}
                            key={team.name}
                            onAccept={props.acceptTeamAction}
                            onReject={props.rejectTeamAction} />
                    )
                }
            </div>
            <button
                disabled={props.teamList.filter(team => team.accept === true).length < 2}
                onClick={() => {
                    props.clearRejectedTeamsAction();
                    props.categorySelectViewAction();
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
        //categorySelectViewAction: () => dispatch(categorySelectViewAction()),
        acceptTeamAction: (sessionId) => dispatch(acceptTeamAction(sessionId)),
        rejectTeamAction: (sessionId) => dispatch(rejectTeamAction(sessionId))
        //clearRejectedTeamsAction: () => dispatch(clearRejectedTeamsAction())
    }
}

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(Lobby)