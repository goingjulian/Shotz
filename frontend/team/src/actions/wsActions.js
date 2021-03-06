import environment from '../environments/environment';
import {
  endRoundScore,
  teamAcceptedAction,
  teamRejectedAction,
  getCurrentQuestion,
  leaveRoomAction
} from './gameActions';
import { viewMessageScreenAction } from './viewActions';
import store from '../store';
import { messageTypes } from './Enums';

let reconnects = 0;

export function initSocket() {
  console.log('Connecting to socket');
  return async dispatch => {
    const socket = await new WebSocket(`${environment.WS_URL}/ws`);

    socket.onopen = () => {
      console.log('Websocket connected');
      reconnects = 0;
    };

    socket.onmessage = eventInfo => {
      const parsedMessage = JSON.parse(eventInfo.data);
      dispatch(handleMessage(parsedMessage));
    };

    socket.onclose = () => {
      if (reconnects < 3 && store.getState().views.wsAllowed) {
        console.log('Trying to reconnect');
        reconnects++;
        setTimeout(() => {
          dispatch(initSocket());
        }, 5000);
      } else {
        console.log('Websocket connection could not be restored');
      }
    };
  };
}

function handleMessage(message) {
  return dispatch => {
    switch (message.type) {
      case 'team_accepted':
        dispatch(viewMessageScreenAction(messageTypes.MSG_ACCEPTED));
        dispatch(teamAcceptedAction());
        break;
      case 'team_rejected':
        dispatch(viewMessageScreenAction(messageTypes.MSG_KICKED));
        dispatch(teamRejectedAction());
        break;
      case 'team_selectingCategories':
        dispatch(viewMessageScreenAction(messageTypes.MSG_SELECTINGCATEGORIES));
        break;
      case 'team_endRound':
        dispatch(endRoundScore(store.getState().game.roomKey, store.getState().game.teamName));
        break;
      case 'team_quizmasterLeft':
        dispatch(viewMessageScreenAction(messageTypes.MSG_QUIZMASTERLEFT));
        dispatch(leaveRoomAction(store.getState().game.roomKey));
        break;
      case 'team_nextQuestion':
        dispatch(getCurrentQuestion(store.getState().game.roomKey));
        break;
      case 'team_answerCorrect':
        dispatch(viewMessageScreenAction(messageTypes.MSG_ANSWERCORRECT));
        break;
      case 'team_answerIncorrect':
        dispatch(viewMessageScreenAction(messageTypes.MSG_ANSWERINCORRECT));
        break;
      case 'team_submitClosed':
        dispatch(viewMessageScreenAction(messageTypes.MSG_SUBMITCLOSED));
        break;
      default:
        console.log('Unknown message: ', message);
        break;
    }
  };
}
