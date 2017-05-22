import React from 'react'
import { connect } from 'react-redux'
import Cart from '../component/Cart'
import { checkout } from '../action'
import { getCartProduct, getCartQuantity, getTotalMoney } from '../reducer/cart'

function CartContainer({ products, total, checkout }) {
    return (
        <div>
            <Cart products={products} total={total} checkout={checkout}/>            
        </div>
    )
}

const matStateToProps = (state) => ({
    products: getCartProduct(state).map(product => ({
        ...product,
        quantity: getCartQuantity(state, product.id)
    })),
    total: getTotalMoney(state)
})

export default connect(
    matStateToProps,
    { checkout }
)(CartContainer)
