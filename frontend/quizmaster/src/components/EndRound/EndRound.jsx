import React from "react";
import * as ReactRedux from "react-redux";
import Navigation from "../Navigation/Navigation";
import { viewCategorySelectionScreen } from "../../actions/viewActions";

class EndRound extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="Component EndRound">
                <Navigation />
                <p>END OF ROUND</p>
                <button onClick={() => this.props.newRound()}>Start new round</button>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {};
}

function mapDispatchToProps(dispatch) {
    return {
        newRound: () => dispatch(viewCategorySelectionScreen())
    };
}

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(EndRound);
