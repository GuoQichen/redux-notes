import { SUBREDDIT_REQUEST, SUBREDDIT_SUCCESS, CHANGE_SUBREDDIT } from '../reducer'

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

export const getPostBySubreddit = subreddit => dispatch => {
    dispatch(getPosts())
    return fetch(`https://www.reddit.com/r/${subreddit}.json`)
        .then(response => 
            response
                .json()
                .then(result => {
                    dispatch(receivePost({ posts: result, subreddit }))
                    return subreddit
                })
        )    
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