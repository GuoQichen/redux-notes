import React from 'react'
import { connect } from 'react-redux'
import ProductList from '../component/ProductList'
import { getVisibleProducts, addToCart } from '../action/product'

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
