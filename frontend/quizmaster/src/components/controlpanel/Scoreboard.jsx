import React from "react";
import Item from "../General/Item";

export default function Scoreboard(props) {
  console.log(props.teams)
  const scoreboard = props.teams.map((team, index) => (
    <Item key={index} index={index + 1} text={team.teamName} closeHandler={() => {}} />
  ));
  return (
    <div className="Scoreboard">
      <header>
        <h1>Scoreboard</h1>
      </header>
      <main>{scoreboard}</main>
    </div>
  );
}


