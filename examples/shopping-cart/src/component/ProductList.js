import React from 'react'
import ProductItem from './ProductItem'
import { shape, number, string, arrayOf } from 'prop-types'

export default function ProductList({ products }) {
    
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
    }).isRequired)
}