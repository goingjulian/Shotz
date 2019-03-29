const initialQuestionsState = {
    questions: [],
    categories: [
        {
            id: 0,
            name: "Tech"
        },
        {
            id: 1,
            name: "Art"
        },
        {
            id: 2,
            name: "Wildlife"
        },
        {
            id: 3,
            name: "Culture"
        }
    ]
}

export default function questionsReducer(state = initialQuestionsState, action) {
    return state;
}