import { SUBREDDIT_REQUEST, SUBREDDIT_SUCCESS, SELECT_SUBREDDIT } from '../reducer'

export const receivePost = ({ posts, subreddit }) => {
    if(posts.kind !== 'Listing') throw new Error('posts isn\'t list')
    const result = posts.data.children.map(post => ({
        id: post.data.id,
        title: post.data.title,
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
    fetch(`https://www.reddit.com/r/${subreddit}.json`)
        .then(response => 
            response.json()
                .then(result => 
                    dispatch(receivePost({ posts: result, subreddit }))
                )
        )    
}

const changeSubreddit = (subreddit) => ({
    type: SELECT_SUBREDDIT,
    subreddit
})

export const changeOption = subreddit => dispatch => {
    dispatch(changeSubreddit(subreddit))
    dispatch(getPostBySubreddit(subreddit))
}