import React from "react";
import "./General.scss";

export default function Item(props) {
  return (
    <div className={props.itemClass + " Item"}>
      {props.index !== undefined && (
        <span className="itemIndex">{props.index}.</span>
      )}
      {props.text !== undefined && (
        <div className="itemTextHolder">
          <span className="itemText">{props.text}</span>
          {props.team !== undefined && (
            <span className="itemTeam">{props.team}</span>
          )}
        </div>
      )}
      <div className="itemButtonsHolder">
        {props.acceptHandler !== undefined && (
          <span className="itemButtonHolder">
            <button className="itemButton__accept">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" />
              </svg>
            </button>
          </span>
        )}
        {props.closeHandler !== undefined && (
          <span className="itemButtonHolder">
            <button className="itemButton__close">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z" />
              </svg>
            </button>
          </span>
        )}
      </div>
    </div>
  );
}
