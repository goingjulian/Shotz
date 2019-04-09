import React from "react";
import * as ReactRedux from "react-redux";

import { getAllCategories, removeCategory } from "../../actions/questionActions";
import "./CategorySelect.scss";
import Navigation from "../Navigation/Navigation";
import { newRound } from "../../actions/roundsActions";
import { addCategory } from "./../../actions/questionActions";

class CategorySelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null
        };
    }

    componentDidMount() {
        this.props.getAllCategories();
    }

    getNoneSelectedItems(categories, selectedCategories) {
        return categories.filter(category => !selectedCategories.includes(category));
    }

    addCategory(category) {
      if (this.props.selectedCategories.length < 3) this.props.addCategory(category);
    }

    render() {
        return (
            <div className="Component CategorySelection categorySelect">
                <Navigation />
                <main>
                    <div className="categories">
                        <h2>Categories</h2>
                        <p>Select at least 1 and max. 3 categories.</p>
                        <ul>
                            {this.getNoneSelectedItems(this.props.categories, this.props.selectedCategories).map((category, index) => {
                                return (
                                    <li key={index} onClick={() => this.addCategory(category)}>
                                        {category}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                    <div className="categories">
                        <h2>Selected categories:</h2>
                        <ul>
                            {this.props.selectedCategories.map((category, index) => {
                                return (
                                    <li key={index} onClick={() => this.props.removeCategory(category)}>
                                        {category}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                    <button
                        disabled={!this.props.selectedCategories.length > 0 || this.state.error}
                        onClick={() => this.props.startRound(this.props.roomKey, this.props.selectedCategories)}
                    >
                        Start round
                    </button>
                </main>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        roomKey: state.room.roomKey,
        categories: state.questions.categories,
        selectedCategories: state.questions.selectedCategories
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getAllCategories: () => dispatch(getAllCategories()),
        startRound: (roomKey, selectedCategories) => dispatch(newRound(roomKey, selectedCategories)),
        addCategory: category => dispatch(addCategory(category)),
        removeCategory: category => dispatch(removeCategory(category))
    };
}

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(CategorySelect);
