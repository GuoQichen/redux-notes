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
                ...action.payload.reduce((prevState, product) => {
                    prevState[product.id] = product
                    return prevState
                }, {})
            }   
        case ADD_TO_CART:
            return {
                ...state,
                [action.payload]: product(state[action.payload], action)
            }
        default:
            return state
    }
}

const visibleProduct = (state = [], action) => {
    switch (action.type) {
        case RETRIVE_PRODUCTS:
            return action.payload.map(product => product.id)
        default:
            return state
    }
}

export default combineReducers({
    productById,
    visibleProduct
})
