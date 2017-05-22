import React from 'react'
import { connect } from 'react-redux'
import ProductList from '../component/ProductList'
import { addToCart } from '../action'
import { getVisibleProducts } from '../reducer/products'

function ProductListContainer({ products, addToCart }) {
    return (
        <div>
            <ProductList products={products} addToCart={addToCart}/>            
        </div>
    )
}

const mapStateToProps = (state) => ({
    products: getVisibleProducts(state)
})

export default connect(
    mapStateToProps,
    { addToCart }
)(ProductListContainer)
