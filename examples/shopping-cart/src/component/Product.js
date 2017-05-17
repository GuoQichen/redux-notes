import React from 'react'
import { string, number } from 'prop-types'

export default function Product({ title, price, quantity }) {
    return (
        <div>
            {title}, ${price} {quantity ? `x${quantity}` : ''}
        </div>
    )
}

Product.propTypes = {
    title: string.isRequired,
    price: number.isRequired,
    quantity: number
}