import React from 'react';
import * as ReactRedux from 'react-redux';

import { getAllCategories } from '../../actions/questionActions';
import './CategorySelect.scss';
import Navigation from '../Navigation/Navigation';
import { newRound } from '../../actions/roundsActions';

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

  addCategory(category) {

  }

  removeCategory(category) {
    
  }

  render() {
    return (
      <div className='Component CategorySelection categorySelect'>
        <Navigation />
        <main>
          <div className='categories'>
            <h2>Categories</h2>
            <ul>
              {this.state.selectedCategories.map(category => {
                return (
                  <li onClick={() => this.addCategory(category)}>{category}</li>
                );
              })}
            </ul>
          </div>
          <div className='categories'>
            <h2>Selected categories:</h2>
            <p>Select at least 1 and max. 3 categories.</p>
            <ul>
              {this.state.selectedCategories.map(category => {
                return (
                  <li onClick={() => this.removeCategory(category)}>{category}</li>
                );
              })}
            </ul>
          </div>
          <button
            disabled={
              !this.state.selectedCategories.length > 0 || this.state.error
            }
            onClick={() =>
              this.props.startRound(
                this.props.roomKey,
                this.state.selectedCategories
              )
            }
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
    startRound: (roomKey, selectedCategories) =>
      dispatch(newRound(roomKey, selectedCategories))
  };
}

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(
  CategorySelect
);

{
  /* <h1>Select question categories</h1>
        <h2>Select min. 1 and max. 3 question categories</h2>

        <select multiple onChange={this.onSelectCategory.bind(this)}>
          {this.props.allCategories.map(cat => (
            <option value={cat} key={cat}>
              {cat}
            </option>
          ))}
        </select>

        <p>
          Hold down the <span className='key'>ctr</span> button on Windows, or
          the <span className='key'>cmd</span> key on mac to select multiple
          items
        </p>

        {this.state.error ? this.state.error : null}

        <button
          disabled={
            !this.state.selectedCategories.length > 0 || this.state.error
          }
          onClick={() =>
            this.props.startRound(
              this.props.roomKey,
              this.state.selectedCategories
            )
          }
        >
          Start round
        </button>
      </div> */
}
