import { getProducts } from '../api/shop'
import { RETRIVE_PRODUCTS, ADD_TO_CART, CART_CHECKOUT } from '../constant/ActionTypes'

export const receiveProducts = (dispatch) => {
    getProducts((products) => {
        dispatch({
            type: RETRIVE_PRODUCTS,
            products
        })
    }, 500)
}

export const addToCart = (id) => ({
    type: ADD_TO_CART,
    productId: id
})

export const checkout = () => ({
    type: CART_CHECKOUT
})