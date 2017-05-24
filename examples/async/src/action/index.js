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
        receivedAt: new Date()
    }))
    return {
        type: SUBREDDIT_SUCCESS,
        posts: result,
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

export const selectSubreddit = subreddit => dispatch => {
    dispatch(getPostBySubreddit(subreddit))
        .then(subreddit => {
            dispatch(changeSubreddit(subreddit))
        })
}