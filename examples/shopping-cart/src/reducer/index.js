import { combineReducers } from 'redux'
import products, { getProduct, getVisibleProducts } from './products'
import cart, { getCartProduct, getCartQuantity } from './cart'

export default combineReducers({
    products,
    cart
})

const getTotalMoney = (state) =>
     getCartProduct(state).reduce((total, product) =>
        total += product.price * getCartQuantity(state, product.id),
        0
    )
    .toFixed(2)

export { 
    getProduct, 
    getVisibleProducts, 
    getCartProduct, 
    getCartQuantity,
    getTotalMoney
}