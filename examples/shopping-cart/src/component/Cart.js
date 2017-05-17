import React from 'react'

export default function Cart() {
    return (
        <div>
            <h1>Cart</h1>

            <p>total money: { ' ' }</p>
            <button disabled={false}>checkout</button>
        </div>
    )
}