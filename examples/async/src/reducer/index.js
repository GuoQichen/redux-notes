import { combineReducers } from 'redux'

// constant
export const CHANGE_SUBREDDIT = 'CHANGE_SUBREDDIT'
export const SUBREDDIT_REQUEST = 'SUBREDDIT_REQUEST'
export const SUBREDDIT_SUCCESS = 'SUBREDDIT_SUCCESS'
export const SUBREDDIT_FAIL = 'SUBREDDIT_FAIL'

// reducer
const selectSubreddit = (state = 'reactjs', action) => {
    switch (action.type) {
        case CHANGE_SUBREDDIT:
            return action.subreddit
        default:
            return state
    }
}

const post = (state = {
    posts: []
}, action) => {
    switch (action.type) {
        case SUBREDDIT_SUCCESS:
            return {
                posts: action.posts,
                receivedAt: action.receivedAt
            }
        default:
            return state
    }
}

const postBySubreddit = (state = {}, action) => {
    switch (action.type) {
        case SUBREDDIT_SUCCESS:
            return {
                ...state,
                [action.subreddit]: post(state, action)
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