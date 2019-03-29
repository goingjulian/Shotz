import React from 'react';
import * as ReactRedux from 'react-redux'

import { loginViewAction, categorySelectViewAction } from '../../actions/viewActions'
import { acceptTeamAction, rejectTeamAction, clearRejectedTeamsAction } from '../../actions/lobbyActions'

import './Lobby.scss'
import Team from './Team.jsx'

function Lobby(props) {
    return (
        <div className="lobby">
            <h1>Waiting for teams</h1>
            <h2>Room key: <span className="highlight">1234</span></h2>
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
            <button onClick={props.loginViewAction}>Back</button>
        </div>
    )
}

function mapStateToProps(state) {
    return {
        teamList: state.lobby.teamList
    }
}

function mapDispatchToProps(dispatch) {
    return {
        loginViewAction: () => dispatch(loginViewAction()),
        categorySelectViewAction: () => dispatch(categorySelectViewAction()),
        acceptTeamAction: (id) => dispatch(acceptTeamAction(id)),
        rejectTeamAction: (id) => dispatch(rejectTeamAction(id)),
        clearRejectedTeamsAction: () => dispatch(clearRejectedTeamsAction())
    }
}

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(Lobby)