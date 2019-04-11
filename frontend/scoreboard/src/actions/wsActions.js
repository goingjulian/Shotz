import environment from '../environments/environment';
import { store } from '../index';
import {
  nextQuestionAction,
  endRoundScore,
  getTeams,
  endGameAction,
  selectingCategoriesAction,
  revealAnswerAction
} from './gameActions';
import { viewGameScreenAction } from './viewActions';

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
  console.log('WEBSOCKET MESSAGE:');
  console.log(message);
  console.log('---------');
  return dispatch => {
    switch (message.type) {
      case 'scoreB_team_accepted':
      case 'scoreB_team_rejected':
        dispatch(getTeams(store.getState().game.roomKey));
        break;
      case 'scoreB_selectingCategories':
        dispatch(selectingCategoriesAction());
        dispatch(viewGameScreenAction());
        break;
      case 'scoreB_endRound':
        dispatch(endRoundScore(store.getState().game.roomKey));
        break;
      case 'scoreB_nextQuestion':
        dispatch(nextQuestionAction(message.currentQuestionIndex, message.currentQuestion));
        dispatch(viewGameScreenAction());
        break;
      case 'scoreB_quizmasterLeft':
        dispatch(endGameAction(message.teams));
        break;
      case 'scoreB_revealAnswer':
        dispatch(revealAnswerAction());
        break;
      default:
        console.log('Unknown message: ', message);
    }
  };
}
