import { combineReducers } from 'redux'
import { RETRIVE_PRODUCTS, ADD_TO_CART } from '../constant/ActionTypes'

const product = (state, action) => {
    switch (action.type) {
        case ADD_TO_CART:
            return {
                ...state,
                inventory: state.inventory > 0 ? --state.inventory : 0
            }
        default:
            return state
    }
}

const productById = (state = {}, action) => {
    switch (action.type) {
        case RETRIVE_PRODUCTS:
            return {
                ...state,
                ...action.products.reduce((prevState, product) => {
                    prevState[product.id] = product
                    return prevState
                }, {})
            }   
        default:
            const { productId } = action
            if(productId) {
                return {
                    ...state,
                    [action.productId]: product(state[action.productId], action)
                }
            }
            return state
    }
}

const visibleProduct = (state = [], action) => {
    switch (action.type) {
        case RETRIVE_PRODUCTS:
            return action.products.map(product => product.id)
        default:
            return state
    }
}

export default combineReducers({
    productById,
    visibleProduct
})
