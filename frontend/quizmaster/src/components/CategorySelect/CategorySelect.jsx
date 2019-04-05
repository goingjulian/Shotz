import React from 'react'
import * as ReactRedux from 'react-redux'

import { startRound } from '../../actions/roundsActions'
import { getAllCategories } from '../../actions/questionActions'
import './CategorySelect.scss'

class CategorySelect extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedCategories: [],
            error: null
        }
    }

    componentDidMount() {
        this.props.getAllCategories()
    }

    render() {
        return (
            <div className="categorySelect">
                <h1>Select question categories</h1>
                <h2>Select min. 1 and max. 3 question categories</h2>

                <select multiple onChange={this.onSelectCategory.bind(this)}>
                    {this.props.allCategories.map(cat => <option value={cat} key={cat}>{cat}</option>)}
                </select>

                <p>Hold down the <span className="key">ctr</span> button on Windows,
                or the <span className="key">cmd</span> key on mac to select multiple items</p>

                {this.state.error ? this.state.error : null}

                <button
                    disabled={!this.state.selectedCategories.length > 0 || this.state.error}
                    onClick={() => this.props.startRound(this.props.roomKey, this.state.selectedCategories)}>
                    Start round</button>
            </div>
        )
    }

    onSelectCategory(event) {
        const options = event.target.options;
        const selectedCategories = [];
        for (let i = 0, l = options.length; i < l; i++) {
            if (options[i].selected) {
                selectedCategories.push(options[i].value);
            }
        }
        console.log(selectedCategories)
        if (selectedCategories.length > 3) {
            this.setState({
                error: "You have already selected 3 categories"
            })
        } else {
            this.setState({
                selectedCategories: selectedCategories,
                error: null
            })
        }
    }

}

function mapStateToProps(state) {
    console.log(state)
    return {
        roomKey: state.room.roomKey,
        allCategories: state.questions.allCategories
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getAllCategories: () => dispatch(getAllCategories()),
        startRound: (roomKey, selectedCategories) => dispatch(startRound(roomKey, selectedCategories))
    }
}

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(CategorySelect)