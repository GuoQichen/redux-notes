import React, { Component } from 'react'

export default class Header extends Component {
    render() {
        const inputStyle = {
            width: '300px',
            margin: '20px 0'
        }
        return (
            <div>
                Type a username or repo full name and hit 'Go':
                <main>
                    <input 
                        type="text" 
                        style={inputStyle}
                    />
                    <button>Go!</button>
                </main>
            </div>
        )
    }
}