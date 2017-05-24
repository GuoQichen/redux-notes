import subredditNodejs from './subreddit-nodejs.json'
import subredditReactjs from './subreddit-reactjs.json'

const defaultTime = 500
const getSubreddit = subreddit => (cb, time) => {
    setTimeout(() => {
        cb(subreddit === 'reactjs' ? subredditReactjs : subredditNodejs)
    }, time || defaultTime)
}

export default getSubreddit