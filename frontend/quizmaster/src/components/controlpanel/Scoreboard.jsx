import React from "react";
import Item from "../General/Item";

export default function Scoreboard(props) {
  console.log(props.teams)

  const sortedTeam = sortTeamsByScore(props.teams);
  console.log(sortedTeam)
  const scoreboard = sortedTeam.map((team, index) => {
    console.log(team.score)
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
      <p>Trucje toegepast. Wanneer er 2 teams over zijn kun je deze niet verwijderen. Moet eigenlijk dan quiz beëindigen</p>
    </div>
  );
}

function sortTeamsByScore(teams) {
  return teams.sort((a, b) => {
    if(a.score > b.score) return -1
    if(a.score < b.score) return 1
    return 0
  })
}

