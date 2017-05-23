import { combineReducers } from 'redux'

// constant
export const SELECT_SUBREDDIT = 'SELECT_SUBREDDIT'

// reducer
const selectSubreddit = (state = 'reactjs', action) => {
    switch (action.type) {
        case SELECT_SUBREDDIT:
            return action.subreddit
        default:
            return state
    }
}

const postBySubreddit = (state = {}, action) => {
    switch (action.type) {
        default:
            return state
    }
}

export default combineReducers({
    selectSubreddit,
    postBySubreddit
})