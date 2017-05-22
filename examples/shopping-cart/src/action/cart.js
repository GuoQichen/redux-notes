import { CART_CHECKOUT } from '../constant/ActionTypes'

export const getCartProduct = (state) => state.cart.productId.map(id => state.products.productById[id])
export const getCartQuantity = (state, id) => state.cart.quantity[id]
export const getTotalMoney = (state) =>
     getCartProduct(state).reduce((total, product) =>
        total += product.price * getCartQuantity(state, product.id),
        0
    )
    .toFixed(2)

export const checkout = () => ({
    type: CART_CHECKOUT
})