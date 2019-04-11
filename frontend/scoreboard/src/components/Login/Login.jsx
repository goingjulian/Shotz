import React from 'react';
import * as ReactRedux from 'react-redux';
import './Login.scss';
import { joinRoom } from './../../actions/gameActions';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roomKey: '',
      teamName: ''
    };
  }

  handleInput(e) {
    const target = e.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  submitForm(e) {
    e.preventDefault();
    if (this.state.roomKey === '') {
    } else {
      this.props.joinRoom(this.state.roomKey);
    }
  }

  render() {
    return (
      <div className='Login'>
        <header>
          <h1>Shotz: scoreboard</h1>
        </header>
        <main>
          <div className='inputField'>
            <label htmlFor='roomKey'>Room code:</label>
            <input
              value={this.state.roomKey}
              onChange={e => this.handleInput(e)}
              id='roomKey'
              name='roomKey'
              placeholder='Room code'
              autoComplete='off'
            />
          </div>
          <div className='inputField'>
            <button onClick={e => this.submitForm(e)}>Join quizz</button>
          </div>
        </main>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    joinRoom: roomKey => dispatch(joinRoom(roomKey))
  };
}

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(Login);
