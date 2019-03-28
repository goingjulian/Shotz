import React from 'react';
import './Lobby.scss'

export default function Lobby(props) {
    return (
        <div>
            <div className="teamsContainer">
                <div className="team">
                    Team x
                    <span className="buttons">
                        <button>V</button>
                        <button>X</button>
                    </span>
                </div>
                <div className="team">
                    Team x
                    <span className="buttons">
                        <button>V</button>
                        <button>X</button>
                    </span>
                </div>
            </div>
            <button>Start quiz</button>
        </div>
    )
}