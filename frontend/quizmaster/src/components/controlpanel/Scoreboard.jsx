import React from "react";
import Item from "../General/Item";

export default function Scoreboard(props) {
  console.log(props.teams)
  const scoreboard = props.teams.map((team, index) => {
    return props.teams.length > 2
      ? <Item key={index} index={index + 1} text={team.teamName} closeHandler={() => { props.removeTeam(team.sessionId) }} />
      : <Item key={index} index={index + 1} text={team.teamName} />
  });
  return (
    <div className="Scoreboard">
      <header>
        <h1>Scoreboard</h1>
      </header>
      <main>{scoreboard}</main>
      <p>Trucje toegepast. Wanneer er 2 teams over zijn kun je deze niet verwijderen. Moet eigenlijk dan quiz beëindigen</p>
    </div>
  );
}


