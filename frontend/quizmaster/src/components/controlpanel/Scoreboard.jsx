import React from "react";
import Item from "../General/Item";

export default function Scoreboard(props) {
  const sortedTeam = props.teams.slice().sort((a, b) => {
    if(a.score > b.score) return -1
    if(a.score < b.score) return 1
    return 0
  });

  const scoreboard = sortedTeam.map((team, index) => {
    return props.teams.length > 2
      ? <Item key={index} index={index + 1} text={`${team.teamName} (${team.score} pts)`} closeHandler={() => { props.removeTeam(team.sessionId) }} />
      : <Item key={index} index={index + 1} text={`${team.teamName} (${team.score} pts)`} />
  });
  
  return (
    <div className="Scoreboard">
      <header>
        <h1>Scoreboard</h1>
      </header>
      <main>{scoreboard}</main>
    </div>
  );
}

