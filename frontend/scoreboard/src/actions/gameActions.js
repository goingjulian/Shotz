import environment from '../environments/environment';
import {
  viewLoginScreenAction,
  viewGameScreenAction,
  viewScoreScreenAction,
  restoreActiveScreenFromGameState
} from './viewActions';

import { initSocket } from './wsActions';

export const gameActionTypes = {
  scoreB_setRoom: 'scoreB_setRoom',
  scoreB_nextQuestion: 'scoreB_nextQuestion',
  scoreB_setScores: 'scoreB_setScores',
  scoreB_setTeams: 'scoreB_setTeams',
  scoreB_endGame: 'scoreB_endGame',
  scoreB_selecting_categories: 'scoreB_selecting_categories',
  scoreB_incCurRound: 'scoreB_incCurRound',
  scoreB_revealAnswer: 'scoreB_revealAnswer'
};

export function nextQuestionAction(currentQuestionIndex, currentQuestion) {
  return {
    type: gameActionTypes.scoreB_nextQuestion,
    currentQuestionIndex: currentQuestionIndex,
    currentQuestion: currentQuestion
  };
}

export function shotzTime() {
  return async dispatch => {
    const options = {
      method: 'GET'
    };
  };
}

export function setRoomAction(roomKey, gameState, currentRound, currentQuestionIndex, teams) {
  return {
    type: gameActionTypes.scoreB_setRoom,
    roomKey: roomKey,
    gameState: gameState,
    currentRound: currentRound,
    currentQuestionIndex: currentQuestionIndex,
    teams: teams
  };
}

export function endRoundScoreAction(scores) {
  return {
    type: gameActionTypes.scoreB_setScores,
    scores: scores
  };
}

export function setTeamsAction(teams) {
  return {
    type: gameActionTypes.scoreB_setTeams,
    teams: teams
  };
}

export function endGameAction(scores) {
  return {
    type: gameActionTypes.scoreB_endGame,
    scores: scores
  };
}

export function selectingCategoriesAction() {
  return {
    type: gameActionTypes.scoreB_selecting_categories
  };
}

export function increaseCurrentRoundAction() {
  return {
    type: gameActionTypes.scoreB_incCurRound
  };
}

export function revealAnswerAction() {
  return {
    type: gameActionTypes.scoreB_revealAnswer
  };
}

export function joinRoom(roomKey) {
  const options = {
    method: 'POST',
    credentials: 'include'
  };
  return async dispatch => {
    try {
      const response = await fetch(`${environment.API_URL}/room/scoreboard/${roomKey}`, options);

      const body = await response.json();
      console.log('JOIN ROOM');
      console.log(body);
      console.log('----------');
      if (!response.ok) throw new Error(body.error);

      dispatch(
        setRoomAction(
          body.roomKey,
          body.gameState,
          body.currentRound,
          body.currentQuestionIndex,
          body.teams
        )
      );
      dispatch(viewGameScreenAction());
      dispatch(initSocket());
    } catch (err) {
      console.log(err.message);
    }
  };
}

export function restoreSession() {
  return async dispatch => {
    try {
      const options = {
        method: 'GET',
        credentials: 'include'
      };

      const response = await fetch(`${environment.API_URL}/room/restore/ROLE_SCOREBOARD`, options);
      const body = await response.json();
      if (!response.ok) throw new Error(body.error);

      dispatch(
        setRoomAction(
          body.roomKey,
          body.gameState,
          body.currentRound,
          body.currentQuestionIndex,
          body.teams
        )
      );
      dispatch(restoreActiveScreenFromGameState(body.gameState));
      dispatch(initSocket());
    } catch (err) {
      console.log(err.message);
    }
  };
}

export function endRoundScore(roomKey) {
  return async dispatch => {
    try {
      const method = {
        method: 'GET',
        credentials: 'include'
      };
      const response = await fetch(`${environment.API_URL}/room/${roomKey}/teams/scores`, method);

      const body = await response.json();
      console.log('GET SCORE END ROUND');
      console.log(body);
      console.log('----------');
      if (!response.ok) {
        throw new Error(body.error);
      } else {
        dispatch(endRoundScoreAction(body));
        dispatch(viewScoreScreenAction());
        dispatch(increaseCurrentRoundAction());
      }
    } catch (err) {
      console.log(err.message);
    }
  };
}

export function getTeams(roomKey) {
  return async dispatch => {
    const options = {
      method: 'GET',
      credentials: 'include'
    };

    const response = await fetch(`${environment.API_URL}/room/${roomKey}/teams`, options);

    if (!response.ok) throw new Error('Error while fetching teams');

    const body = await response.json();

    console.log(body);

    dispatch(setTeamsAction(body));
  };
}

export function teamAcceptedAction() {
  return {
    type: 'team_accepted'
  };
}

export function teamRejectedAction() {
  return {
    type: 'team_rejected'
  };
}

export function leaveRoomAction() {
  return {
    type: 'team_leaveRoom'
  };
}

export function leaveRoom(roomKey) {
  return dispatch => {
    const method = {
      method: 'DELETE',
      credentials: 'include'
    };
    fetch(`${environment.API_URL}/room/${roomKey}/leave`, method)
      .then(async response => {
        const body = await response.json();
        console.log('LEAVING ROOM');
        console.log(body);
        console.log('----------');
        dispatch(viewLoginScreenAction());
        dispatch(leaveRoomAction());
      })
      .catch(err => {
        console.log(err.message);
      });
  };
}
