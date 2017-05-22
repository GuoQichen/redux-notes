import { combineReducers } from 'redux'
import { ADD_TO_CART, CART_CHECKOUT } from '../constant/ActionTypes'

const productId = (state = [], action) => {
    switch (action.type) {
        case ADD_TO_CART:
            return state.indexOf(action.payload) !== -1 ? state : [...state, action.payload]
        case CART_CHECKOUT:
            return []
        default:
            return state
    }
}

const quantity = (state = {}, action) => {
    switch (action.type) {
        case ADD_TO_CART:
            return {
                ...state,
                [action.payload]: state[action.payload] ? ++state[action.payload] : 1
            }
        case CART_CHECKOUT:
            return {}            
        default: 
            return state
    }
}

export default combineReducers({
    productId,
    quantity
})