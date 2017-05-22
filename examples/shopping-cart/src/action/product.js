import { getProducts } from '../api/shop'
import { RETRIVE_PRODUCTS, ADD_TO_CART } from '../constant/ActionTypes'

export const receiveProducts = (dispatch) => {
    getProducts((products) => {
        dispatch({
            type: RETRIVE_PRODUCTS,
            payload: products
        })
    }, 500)
}

export const addToCart = (id) => ({
    type: ADD_TO_CART,
    payload: id
})

export const getProduct = (state, id) => state.products.productById[id]
export const getVisibleProducts = (state) => state.products.visibleProduct.map(id => getProduct(state, id))
