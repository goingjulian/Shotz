import React from 'react';

export default function Team(props) {
    return (
        <div className={props.team.accept ? "team accept" : "team"}>
            {props.team.name}
            <span className="buttons">
                {!props.team.accept ? <button onClick={() => props.onAccept(props.team.id)}>V</button> : null}
                <button onClick={() => props.onReject(props.team.id)}>X</button>
            </span>
        </div>
    )
}