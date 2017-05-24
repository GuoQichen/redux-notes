const request = require('superagent')
const fs = require('fs')
const path = require('path')

const target = ['reactjs', 'nodejs']
const getUrl = subreddit => `https://www.reddit.com/r/${subreddit}.json`
const apiPath = subreddit => path.resolve(process.cwd(), `src/api/subreddit-${subreddit}.json`)

const getDate = subreddit => {
    request
        .get(getUrl(subreddit))
        .end((err, res) => {
            if(err) return console.log(err)
            fs.writeFileSync(apiPath(subreddit), res.text)
            console.log(`write ${subreddit} done!`)
        })
}

target.forEach(subreddit => getDate(subreddit))