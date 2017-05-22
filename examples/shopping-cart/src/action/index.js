import { getProducts } from '../api/shop'
import { RETRIVE_PRODUCTS, ADD_TO_CART, CART_CHECKOUT } from '../constant/ActionTypes'

// export const receiveProducts = (dispatch) => {
//     getProducts((products) => {
//         dispatch({
//             type: RETRIVE_PRODUCTS,
//             products
//         })
//     }, 500)
// }

export const receiveProducts = () => (dispatch, getState) => {
    getProducts(products => {
        dispatch({
            type: RETRIVE_PRODUCTS,
            products            
        })
    }, 500)
}

export const addToCart = (id) => (dispatch, getState) => {
    dispatch({
        type: ADD_TO_CART,
        productId: id
    })
}

export const checkout = () => (dispatch, getState) => {
    dispatch({
        type: CART_CHECKOUT
    })
}