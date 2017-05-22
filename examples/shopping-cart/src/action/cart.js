import { CART_CHECKOUT } from '../constant/ActionTypes'

export const getCartProduct = (state) => state.cart.productId.map(id => state.products.productById[id])
export const getCartQuantity = (state, id) => state.cart.quantity[id]
export const getTotalMoney = (state) => {
    const total = getCartProduct(state).reduce((total, product) => { 
        return total += product.price * getCartQuantity(state, product.id)
    }, 0)
    return total.toFixed(2)
}
export const checkout = () => ({
    type: CART_CHECKOUT
})