import { combineReducers } from 'redux'
import { ADD_TO_CART, CART_CHECKOUT } from '../constant/ActionTypes'

const initState = {
    productId: [],
    quantity: {}
}

const productId = (state = initState.productId, action) => {
    switch (action.type) {
        case ADD_TO_CART:
            return state.indexOf(action.productId) !== -1 ? state : [...state, action.productId]
        default:
            return state
    }
}

const quantity = (state = initState.quantity, action) => {
    switch (action.type) {
        case ADD_TO_CART:
            return {
                ...state,
                [action.productId]: state[action.productId] ? ++state[action.productId] : 1
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


// 业务逻辑中需要用到的help function
export const getCartProduct = ({ cart, products }) => cart.productId.map(id => products.productById[id])
export const getCartQuantity = ({ cart }, id) => cart.quantity[id]

