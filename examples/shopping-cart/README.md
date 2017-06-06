# shopping-cart
这个例子主要介绍了redux在购物车的业务场景下的使用

## usage
```
yarn start
```

## analysis

从`src/container/App.js`开始看，可以看到例子主要有两部分，一部分是商品列表的展示，另一部分是购物车里的商品购买数量，首先从`ProductsContainer`开始看，在container中整个组件的逻辑是比较简单的，有两个props，一个是商品的列表，一个是把商品添加进购物车的action，现在顺着`getVisibleProducts`来看数据结构的设计，也就是reducer和state的设计

```js
export default combineReducers({
  byId,
  visibleIds
})
```
这边使用了redux的工具函数`combineRedeuers`，基本的思路就是在`byId`中保存着以Id为索引的所有商品信息，在代码中的体现就是Id为key的对象，然后在`visibleIds`中保存的是要展示的商品的Id，虽然这个demo的所有商品都是展示的，但是在真实的业务场景下，可能会有一些业务需求，例如，特价的一些商品，卖完了就不展示，或者一些只有新用户才能看到的商品等等，使用`visibleIds`可以把这一层业务很好的抽象出来

```js
const visibleIds = (state = [], action) => {
  switch (action.type) {
    case RECEIVE_PRODUCTS:
      return action.products.map(product => product.id)
    default:
      return state
  }
}
```
在`visibleIds`的reducer中，也可以看到获取商品后，映射商品的Id到这个数组中。然后看`byId`的reducer

```js
const byId = (state = {}, action) => {
  switch (action.type) {
    case RECEIVE_PRODUCTS:
      return {
        ...state,
        ...action.products.reduce((obj, product) => {
          obj[product.id] = product
          return obj
        }, {})
      }
    default:
      const { productId } = action
      if (productId) {
        return {
          ...state,
          [productId]: products(state[productId], action)
        }
      }
      return state
  }
}
```
`byId`中的逻辑主要有两部分，一部分是对`byId`整个对象的修改，如果添加新的商品，一部分是对某个商品进行修改，在第一部中，action主要是接收新的商品，接收到的`products`是一个数组，然后归纳成以Id为key的对象，`byId`把第二部分的逻辑抽象成另外一个reducer

```js
const products = (state, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      return {
        ...state,
        inventory: state.inventory - 1
      }
    default:
      return state
  }
}
```
在这个demo中，对商品修改的action暂时只有一个，就是当把商品添加进购物车的时候，把商品的库存减去，可想而知在实际的业务场景中可能会有更多的需求去修改商品，所以这样把对个别商品修改的逻辑抽象出来是非常有益的，然后在这个文件中还有两个对外暴露的api，对通过Id拿到对应的商品的过程作了简单封装，提供了更加直观的api

```js
export const getProduct = (state, id) =>
  state.byId[id]
export const getVisibleProducts = state =>
  state.visibleIds.map(id => getProduct(state, id))
```
至此，第一部分商品展示container就完了，然后是购物车的container

从`src/container/CartContainer.js`的最后，我们可以看到，container往组件中注入了三个props

```js
const mapStateToProps = (state) => ({
  products: getCartProducts(state),
  total: getTotal(state)
})
export default connect(
  mapStateToProps,
  { checkout }
)(CartContainer)
```
三个props分别是购买的商品列表，购买商品的总价，结算的action，我们先进入`getCartProducts`的逻辑

```js
export const getCartProducts = state =>
  getAddedIds(state).map(id => ({
    ...getProduct(state, id),
    quantity: getQuantity(state, id)
  }))
```
思路主要是这样的，使用`getAddedIds`获取已经添加到购物车的商品的Id，然后购物车显示的商品和商品列表展示的商品区别在于，购物车的商品多了一个购买数量属性，所以这里使用product的reducer暴露的api，`getProduct`，然后`quantity`来表示购买的数量，现在进入`getQuantity`的逻辑来看看购物车的reducer和state如何设计

```js
const cart = (state = initialState, action) => {
  switch (action.type) {
    case CHECKOUT_REQUEST:
      return initialState
    case CHECKOUT_FAILURE:
      return action.cart
    default:
      return {
        addedIds: addedIds(state.addedIds, action),
        quantityById: quantityById(state.quantityById, action)
      }
  }
}
export default cart
```
在购物的reducer中，这里没有使用redux的`combineReducers`，主要是因为这里存在不需要分发的action，在checkout的请求发起的时候，就把购物车的状态设置为初始的空购物车的状态，当请求失败的时候，就回到原来的购物车状态，当请求成功的时候，就什么也不做。在购物车的state中，有两部分，一部分是添加到购物车的商品的Id，另一部分是商品购买的数量，以Id作为key，数量作为value

```js
const addedIds = (state = initialState.addedIds, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      if (state.indexOf(action.productId) !== -1) {
        return state
      }
      return [ ...state, action.productId ]
    default:
      return state
  }
}
```
在`addedIds`的reducer中，如果购买的商品没有添加过购物车，就什么也不做，否则就在把商品的Id添加进`addedIds`的数组中

```js
const quantityById = (state = initialState.quantityById, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      const { productId } = action
      return { 
        ...state,
        [productId]: (state[productId] || 0) + 1
      }
    default:
      return state
  }
}
```
在`quantityById`中，只有一个action，添加进购物车的action，如果第一次购买，那么就是数量就是1，然后回到reducer的Index页面

```js
export const getTotal = state =>
  getAddedIds(state)
    .reduce((total, id) =>
      total + getProduct(state, id).price * getQuantity(state, id),
      0
    )
    .toFixed(2)
export const getCartProducts = state =>
  getAddedIds(state).map(id => ({
    ...getProduct(state, id),
    quantity: getQuantity(state, id)
  }))
```
对外暴露`getCartProducts`、`getTotal`都是对基本的api进行封装，其实就是两部分，从product获得商品，从cart获得数量，回到cart的container，这里传递到UI组件的props还有一个action，check

```js
export const checkout = products => (dispatch, getState) => {
  const { cart } = getState()
  dispatch({
    type: types.CHECKOUT_REQUEST
  })
  shop.buyProducts(products, () => {
    dispatch({
      type: types.CHECKOUT_SUCCESS,
      cart
    })
    // Replace the line above with line below to rollback on failure:
    // dispatch({ type: types.CHECKOUT_FAILURE, cart })
  })
}
```
在`checkout`中，使用了`redux-thunk`，先获取到cart的状态，如果在请求失败的时候可以回滚购物车的状态，其实在`CHECKOUT_REQUEST`发出的时候已经把购物车回到初始状态了，如果成功就什么都不做，如果失败就回滚

```js
const addToCartUnsafe = productId => ({
  type: types.ADD_TO_CART,
  productId
})
export const addToCart = productId => (dispatch, getState) => {
  if (getState().products.byId[productId].inventory > 0) {
    dispatch(addToCartUnsafe(productId))
  }
}
```
在把商品添加到购物车的时候，这边有两个api，一个是简单的action creator，不做任何限制，所以叫做`addToCartUnsafe`，另一个是`addToCart`，这边使用`redux-thunk`延迟了dispatch，先做了一个条件判断，判断库存是否大于0

## 总结
这个demo在state的设计上，不直接操作整个商品详情，而是使用Id，这也是redux推荐的方式