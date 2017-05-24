import React from 'react'

const SelectSubreddit = ({ selectSubreddit }) => {

    return (
        <div>
            <select name="subreddit" onChange={(e) => selectSubreddit(e.target.value)}>
                <option value="reactjs">reactjs</option>
                <option value="nodejs">nodejs</option>
            </select>
        </div>
    )
}

export default SelectSubreddit