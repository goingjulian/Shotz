import React from "react";
import Item from "../General/Item";

export default function Scoreboard(props) {
  const teams = [
    "Fritzzers",
    "Meronnetjes",
    "Hardleers",
    "Da voice"
  ];
  const scoreboard = teams.map((team, index) => (
    <Item key={index} index={index} text={team} closeHandler={() => {}} />
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


