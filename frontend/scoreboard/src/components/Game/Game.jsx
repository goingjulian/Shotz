import React from "react";
import * as ReactRedux from "react-redux";
import "./Game.scss";
import shot from './shot.png'
import { joinRoom } from './../../actions/gameActions';
import Navigation from "../Navigation/Navigation.jsx";
import Item from '../General/Item.jsx'

function Game(props) {
    return (
        <div className="Game">
            <nav>
                <div className="navInner">
                    <div className="navLeft">
                        <button>Leave</button>
                    </div>

                    <div className="navMiddle">
                        <h2>Question 3/12</h2>
                        <h2>Round 2</h2>
                    </div>

                    <div className="navRight">
                        <span>3 players connected</span>
                    </div>

                </div>
            </nav>
            <main>
                <div className="message">
                    <div className="mainMsg">
                        Shotz!
                            <img src={shot} alt="A Shot Glass" />
                    </div>
                    <div className="subMsg">
                        Team julian
                        </div>
                </div>
                <div className="divider" />
                <div className="teams">
                    <Item
                        key={1}
                        text="Een team (10 pts)"
                        itemClass={`team`}
                    />
                    <Item
                        key={2}
                        text="Nog Een team (10 pts)"
                        itemClass={`team`}
                    />
                    <Item
                        key={3}
                        text="de matenaaiers (10 pts)"
                        itemClass={`team`}
                    />
                    <Item
                        key={4}
                        text="Laatste team (10 pts)"
                        itemClass={`team`}
                    />
                </div>
            </main>
        </div>
    );

}

function mapStateToProps(state) {
    return {};
}

function mapDispatchToProps(dispatch) {
    return {
        joinRoom: (roomKey) => dispatch(joinRoom(roomKey))
    };
}

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(Game);
