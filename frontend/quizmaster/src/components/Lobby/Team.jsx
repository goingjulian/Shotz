import React from 'react';

export default function Team(props) {
    return (
        <div className={props.team.accepted ? "team accept" : "team"}>
            {props.team.teamName}
            <span className="buttons">
                {!props.team.accepted ? <button onClick={() => props.onAccept(props.roomKey, props.team.sessionId)}>V</button> : null}
                <button onClick={() => props.onReject(props.roomKey, props.team.sessionId)}>X</button>
            </span>
        </div>
    )
}