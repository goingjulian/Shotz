export const roundsActionTypes = {
    startRound: "startRound"
}

export function startRound(categories) {
    return {
        type: roundsActionTypes.startRound,
        categories: categories
    }
}
