import products from './products.json'

const TIME = 100

export function getProducts(cb, time) {
    setTimeout(() => {
        cb.call(this, products)
    }, time || TIME)
}
