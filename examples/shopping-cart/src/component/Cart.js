import React from 'react'
import Product from './Product'
import { number, func, array, string } from 'prop-types'

export default function Cart({ products, total, checkout }) {
    return (
        <div>
            <h1>Cart</h1>
            <div>
                {
                    products.map(product => (
                        <Product key={product.id} title={product.title} price={product.price} quantity={product.quantity}/>
                    ))
                }
            </div>
            <p>total money: ${total}</p>
            <button disabled={products.length === 0} onClick={checkout}>checkout</button>
        </div>
    )
}

Cart.propTypes = {
    products: array,
    total: string.isRequired,
    checkout: func.isRequired
}