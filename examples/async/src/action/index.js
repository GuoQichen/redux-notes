import { SUBREDDIT_REQUEST, SUBREDDIT_SUCCESS, CHANGE_SUBREDDIT } from '../reducer'
import getSubreddit from '../api'

const getSubredditAsync = subreddit => Promise.resolve({ then(onFulfilled, onRejected) {
    getSubreddit(subreddit)((data) => {
        onFulfilled(data)
    })
}})

export const receivePost = ({ posts, subreddit }) => {
    if(posts.kind !== 'Listing') throw new Error('posts isn\'t list')
    const result = posts.data.children.map(post => ({
        id: post.data.id,
        title: post.data.title,
    }))
    return {
        type: SUBREDDIT_SUCCESS,
        posts: result,
        receivedAt: new Date(),        
        subreddit
    }
}

export const getPosts = () =>  ({
    type: SUBREDDIT_REQUEST,
})

export const getPostBySubreddit = subreddit => (dispatch, getState) => {
    subreddit = subreddit || getState().selectSubreddit
    dispatch(getPosts())
    return getSubredditAsync(subreddit).then(posts => {
        dispatch(receivePost({ posts, subreddit }))
        return subreddit
    })
}

const changeSubreddit = (subreddit) => ({
    type: CHANGE_SUBREDDIT,
    subreddit
})

export const refresh = subreddit => dispatch => {
    dispatch(getPostBySubreddit(subreddit))
        .then(subreddit => {
            dispatch(changeSubreddit(subreddit))
        })
}

export const selectSubreddit = subreddit => (dispatch, getState) => {
    const subredditPost = getState().postBySubreddit[subreddit]
    if(subredditPost) {
        dispatch(changeSubreddit(subreddit))
    } else {
        refresh(subreddit)(dispatch)
    }
}

