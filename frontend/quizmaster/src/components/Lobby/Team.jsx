import React from 'react';

export default function Team(props) {
    return (
        <div className={props.team.accept ? "team accept" : "team"}>
            {props.team.name}
            <span className="buttons">
                <button disabled={props.accept} onclick={() => props.accetTeamAction(props.team.id)}>V</button>
                <button onClick={() => props.rejectTeamAction(props.team.id)}>X</button>
            </span>
        </div>
    )
}