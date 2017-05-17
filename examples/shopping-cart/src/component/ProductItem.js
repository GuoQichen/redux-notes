import React from 'react'

import Product from './Product'

export default function ProductItem({ title, price, inventory }) {
    return (
        <div>
            <Product title={title} price={price} />
            <button disabled={inventory < 0}>buy</button>
        </div>
    )
}