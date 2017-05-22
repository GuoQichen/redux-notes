import React from 'react'
import ProductItem from './ProductItem'
import { shape, number, string, arrayOf, func } from 'prop-types'

export default function ProductList({ products, addToCart }) {
    
    return (
        <div>
            <h1>Product List</h1>
            {
                products.map(({ id, title, price, inventory }) => (
                    <ProductItem 
                        key={id}
                        title={title}    
                        price={price}
                        inventory={inventory}
                        addToCart={() => addToCart(id)}
                    />
                ))
            }
        </div>
    )
}

ProductList.propTypes = {
    products: arrayOf(shape({
        id: number.isRequired,
        title: string.isRequired,
        price: number.isRequired,
        inventory: number.isRequired
    }).isRequired),
    addToCart: func.isRequired
}