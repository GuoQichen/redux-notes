import { combineReducers } from 'redux'

// constant
export const SELECT_SUBREDDIT = 'SELECT_SUBREDDIT'
export const SUBREDDIT_REQUEST = 'SUBREDDIT_REQUEST'
export const SUBREDDIT_SUCCESS = 'SUBREDDIT_SUCCESS'
export const SUBREDDIT_FAIL = 'SUBREDDIT_FAIL'

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
        case SUBREDDIT_SUCCESS:
            return {
                ...state,
                [action.subreddit]: action.posts
            }
        default:
            return state
    }
}

const fetch = (state = false, action) => {
    switch (action.type) {
        case SUBREDDIT_REQUEST:
            return true
        case SUBREDDIT_SUCCESS:
        case SUBREDDIT_FAIL:
            return false
        default:
            return state
    }
}

export default combineReducers({
    selectSubreddit,
    postBySubreddit,
    fetch
})