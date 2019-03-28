import React from 'react';
import * as ReactRedux from 'react-redux'

import { loginViewAction } from '../../actions/viewActions'
import { acceptTeamAction, rejectTeamAction } from '../../actions/teamActions'

import './Lobby.scss'
import Team from './Team.jsx'

function Lobby(props) {
    return (
        <div className="lobby">
            <h1>Waiting for teams</h1>
            <h2>Room key: <span className="highlight">1234</span></h2>
            <h2><span className="highlight">0</span> teams joined</h2>
            <div className="teamsContainer">
                {
                    props.teams.map(team =>
                        <Team
                            team={team}
                            key={team.name}
                            onAccept={props.acceptTeamAction}
                            onReject={props.rejectTeamAction} />
                    )
                }
            </div>
            <button>Start quiz</button>
            <button onClick={props.loginViewAction}>Back</button>
        </div>
    )
}

function mapStateToProps(state) {
    return {
        teams: state.teams
    }
}

function mapDispatchToProps(dispatch) {
    return {
        loginViewAction: () => dispatch(loginViewAction()),
        acceptTeamAction: () => dispatch(acceptTeamAction()),
        rejectTeamAction: () => dispatch(rejectTeamAction())
    }
}

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(Lobby)