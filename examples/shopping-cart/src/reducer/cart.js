import { combineReducers } from 'redux'
import { ADD_TO_CART, CART_CHECKOUT } from '../constant/ActionTypes'

const initState = {
    productId: [],
    quantity: {}
}

const productId = (state = initState.productId, action) => {
    switch (action.type) {
        case ADD_TO_CART:
            return state.indexOf(action.payload) !== -1 ? state : [...state, action.payload]
        default:
            return state
    }
}

const quantity = (state = initState.quantity, action) => {
    switch (action.type) {
        case ADD_TO_CART:
            return {
                ...state,
                [action.payload]: state[action.payload] ? ++state[action.payload] : 1
            }          
        default: 
            return state
    }
}

export default function cartReducer(state = initState, action) {
    switch (action.type) {
        case CART_CHECKOUT:
            return initState
        default:
            return {
                productId: productId(state.productId, action),
                quantity: quantity(state.quantity, action)
            }
    }
}
