import React from 'react'
import { func, array } from 'prop-types'

const Picker = ({ onChange, options }) => {

    return (
        <div>
            <select name="subreddit" onChange={(e) => onChange(e.target.value)}>
                {
                    options.map(value => (
                        <option key={value} value={value}>{value}</option>
                    ))
                }
            </select>
        </div>
    )
}

Picker.proptypes = {
    onChange: func.isRequired,
    options: array.isRequired
}

export default Picker