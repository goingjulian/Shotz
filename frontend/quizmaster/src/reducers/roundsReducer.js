import { roundsActionTypes } from '../actions/roundsActions'

const initialRoundsState = {
    rounds: [
        {
            id: 0,
            categories: [
                "nature",
                "tech",
                "science"
            ],
            questions: [
                {
                    id: 0,
                    question: "What sound does a lion make?",
                    correctAnswer: "Grom",
                    givenAnswers: [
                        {
                            teamId: 0,
                            answer: "grom",
                            correct: true
                        },
                        {
                            teamId: 1,
                            answer: "Woef",
                            correct: false
                        },
                        {
                            teamId: 2,
                            answer: "Miauw",
                            correct: undefined
                        }
                    ]
                }
            ]
        }
    ]
}

export default function roundsReducer(state = initialRoundsState, action) {
    return state;
}