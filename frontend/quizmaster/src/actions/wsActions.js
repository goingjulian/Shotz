import environment from '../environments/environment';
import { store } from '../index';
import { getTeamList, rejectTeamAction, addSubmittedAnswerAction } from './teamActions';

let reconnects = 0;

export function initSocket() {
  console.log('WS: Connecting to websocket');
  return async dispatch => {
    const socket = await new WebSocket(`${environment.WS_URL}/ws`);

    socket.onopen = () => {
      console.log('WS: Websocket connected');
      reconnects = 0;
    };

    socket.onmessage = eventInfo => {
      const parsedMessage = JSON.parse(eventInfo.data);
      dispatch(handleMessage(parsedMessage));
    };

    socket.onclose = () => {
      console.log('WS: Websocket disconnected');

      if (reconnects < 3 && store.getState().views.wsAllowed) {
        console.log('WS: Trying to reconnect websocket');
        reconnects++;
        setTimeout(() => {
          dispatch(initSocket());
        }, 5000);
      } else {
        console.log('WS: Websocket connection could not be restored');
      }
    };
  };
}

function handleMessage(message) {
  console.log(message);
  return dispatch => {
    switch (message.type) {
      case 'quizmaster_newTeam':
        const roomKey = store.getState().room.roomKey;
        dispatch(getTeamList(roomKey));
        break;
      case 'quizmaster_teamLeft':
        dispatch(rejectTeamAction(message.sessionId));
        break;
      case 'quizmaster_answerSubmitted':
        dispatch(
          addSubmittedAnswerAction(message.teamSessionId, message.questionId, message.answer)
        );
        break;
      default:
        console.log('Unknown message: ', message);
    }
  };
}
