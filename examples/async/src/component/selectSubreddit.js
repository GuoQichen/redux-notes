import React from 'react'

const SelectSubreddit = ({ changeSubreddit }) => {

    return (
        <div>
            <select name="subreddit" onChange={(e) => changeSubreddit(e.target.value)}>
                <option value="reactjs">reactjs</option>
                <option value="nodejs">nodejs</option>
            </select>
        </div>
    )
}

export default SelectSubreddit