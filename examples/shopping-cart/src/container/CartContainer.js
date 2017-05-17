import React from 'react'
import { connect } from 'react-redux'
import Cart from '../component/Cart'
import products from '../api/products.json'


export default function CartContainer() {
    return (
        <div>
            <Cart />            
        </div>
    )
}
