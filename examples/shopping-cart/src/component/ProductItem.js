import React from 'react'
import Product from './Product'
import { string, number, func } from 'prop-types'

export default function ProductItem({ title, price, inventory, addToCart }) {
    return (
        <div>
            <Product title={title} price={price} />
            <button disabled={inventory <= 0} onClick={addToCart}>buy</button>
        </div>
    )
}

ProductItem.propTypes = {
    title: string.isRequired,
    price: number.isRequired,
    inventory: number.isRequired,
    addToCart: func.isRequired
}