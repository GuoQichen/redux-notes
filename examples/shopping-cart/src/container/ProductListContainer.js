import React from 'react'
import { connect } from 'react-redux'
import ProductList from '../component/ProductList'
import products from '../api/products.json'

export default function ProductListContainer() {
    return (
        <div>
            <ProductList products={products}/>            
        </div>
    )
}
