import environment from '../environments/environment';
import { store } from '../index';
import {
  nextQuestionAction,
  endRoundScore,
  getTeams,
  endGameAction,
  selectingCategoriesAction,
  revealAnswerAction,
  setQuestionStatus
} from './gameActions';
import { viewGameScreenAction, viewScoreScreenAction } from './viewActions';

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
  return dispatch => {
    switch (message.type) {
      case 'scoreB_team_accepted':
      case 'scoreB_team_rejected':
      case 'scoreB_teamLeft':
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
      case 'scoreB_answerQuestion':
        dispatch(setQuestionStatus(message.teamId, message.questionId, message.correct));
        break;
      case 'scoreB_quizmasterLeft':
        dispatch(viewScoreScreenAction());
        dispatch(endGameAction(message.scores.teams));
        break;
      case 'scoreB_revealAnswer':
        dispatch(revealAnswerAction());
        break;
      default:
        console.log('Unknown message: ', message);
        break;
    }
  };
}
