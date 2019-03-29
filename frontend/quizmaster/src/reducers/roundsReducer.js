import { roundsActionTypes } from '../actions/roundsActions'

const initialRoundsState = {
    rounds: [
        // {
        //     categories: [
        //         1,
        //         2,
        //         3
        //     ],
        //     questions: [
        //         {
        //             id: 0,
        //             question: "What sound does a lion make?",
        //             correctAnswer: "Grom",
        //             givenAnswers: [
        //                 {
        //                     teamId: 0,
        //                     answer: "grom",
        //                     correct: true
        //                 },
        //                 {
        //                     teamId: 1,
        //                     answer: "Woef",
        //                     correct: false
        //                 },
        //                 {
        //                     teamId: 2,
        //                     answer: "Miauw",
        //                     correct: undefined
        //                 }
        //             ]
        //         }
        //     ]
        // }
    ]
}

export default function roundsReducer(state = initialRoundsState, action) {
    switch (action.type) {
        case roundsActionTypes.startRound:
            if (action.categories.length <= 3 && action.categories.length > 0) {
                const roundsCopy = [...state.rounds];
                roundsCopy.push(
                    {
                        categories: action.categories,
                        questions: []
                    }
                );
                return {...state, rounds: roundsCopy}
            } else {
                return state;
            }
        default:
            return state;

    }
}