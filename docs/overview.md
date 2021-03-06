# redux
this is notes of learn redux

## redux的设计原则

1. 单一状态树
2. 状态的改变由action发起
3. 状态的改变由reducer执行

## redux上的功能函数

使用`require('redux')`，得到的是一个对象，对象上包含了核心`createStore`和一些功能函数 
 
```js
{ 
    __esModule: true,
    createStore: [Function: createStore],
    combineReducers: [Function: combineReducers],
    bindActionCreators: [Function: bindActionCreators],
    applyMiddleware: [Function: applyMiddleware],
    compose: [Function: compose] 
}
```

## createStore

创建一个store，接受三个参数:

    - reducer
    - preloadedState

        可以用来指定store的初始状态
    - enhancer

        使用middleware

创建后的store包含以下方法:

```js
{ 
    dispatch: [Function: dispatch],
    subscribe: [Function: subscribe],
    getState: [Function: getState],
    replaceReducer: [Function: replaceReducer] 
}    
```

- dispatch

    分发一个action，action是一个对象，例如:

    ```js
    dispatch({
        type: 'ADD_TODO',
        payload: {
            _id: 1,
            text: 'this is new todo',
            date: new Date()
        }
    })
    ```
    内部实现的关键逻辑在于：

    ```js
    const dispatch = (action) => {
        currentState = rootReducer(currentState, action)
    }
    ```
    所做的事情只是以当前的state和dispatch的action为参数调用一次reducer

- subscribe

    添加一个listener，当dispath一个action的时候会调用，不会传递参数进去

    内部的实现在于存在内部维护的监听器数组，当subscibe的时候，把监听函数push到数组中，dispatch的时候遍历调用数组的每一个监听函数就可以

    ```js
    const listeners = []
    const subscribe = (listener) => {
        // 核心逻辑
        listeners.push(listener)
        // 返回一个可以取消订阅的函数
        return function unSubscribe() {
            const index = listeners.indexOf(listener)
            listeners.splice(index, 1)
        }
        // 之所以可行是因为indexOf里面使用的strict equality，函数所表示的内存地址是一致的
    }
    ```

- getState

    `return currentState`

- replaceReducer

    替换当前的reducer为另一个reducer

    内部实现是把createStore时传递进去的reducer保存在一个currentReducer变量中，当调用replaceReducer的时候替换这个变量的值

    ```js
    const createStore = (reducer, preloadState, enhance) => {
        const currentReducer = reducer
        //...
        const replaceReducer = (reducer) => {
            currentReducer = reducer
            // ... dosomething init
        }
        return {
            replaceReducer,
        }
    }
    ```

## bindActionCreators

1. 接受两种类型的参数, object或者function

```js
//object
const _action = bindActionCreators({
    add: () => ({ type: 'ADD' }),
    del: () => ({ type: 'DEL' })
}, dispatch)
_action.add()
// function 
const add = bindActionCreators(() => ({
    type: 'ADD'
}), dispatch)
add()
```

2. 当参数是函数的时候如何实现

```js
function bindActionCreator(actionCreator, dispatch) {
    return (...args) => dispatch(actionCreator(...args))
}        
```
    
## compose

1. compose的实现

```js
// (a, b, c) => a(b(c()))
const compose = (...funcs) => (...arg) => funcs.length ? funcs.reduceRight((compose, f) => f(compose), funcs.pop()(...arg)) : arg
```

## applyMiddleware

1. 改写dispatch来注入中间件

```js
const _dispatch = store.dispatch
const log = (...arg) => console.log(...arg)
store.dispatch = (action) => {
    log(action.type)
    _dispatch(action)
}
```

2. 中间件的用法

```js
const logger = ({ getState, dispatch }) => next => action => {
    // content
    next(action)
}
```

## combineReducers

1. 使用方法

```js
// 如果creatorStore中指定preloadState, userListReducer中的state就是对应的state
const finalReducer = combineReducers({
    userList: userListReducer,
    productList: productListReducer
})        
creatorStore(finalreducer, { userList: [], productList: []})
```

2. 简单实现

```js
const combineReducers = (reducers) => (state, action) => Object.keys(reducers).reduce((prevState, key) => {
    prevState[key] = reducers[key](state[key], action)
    return prevState
}, {})
// tese-case
const state = combineReducers({
    one: (state, action) => ({ reducer1: 'reducer1' }),
    two: (state, action) => ({ reducer2: 'reducer2' })
})()
console.log(state)                 
```

## 一些最佳实践

add new item to state array

```js
// bad and does not work
case "ADD":
    return state.push(newItem);
// Good
case "ADD":
    return [
        ...state,
        newItem
    ];
```

delete new item to state array

```js
// bad and does not work
case "DELETE":
    return state.splice(index, 1);
// Good
case "DELETE":
    return state.slice(0, index).concat(state.slice(index + 1));
// another way
case 'DELETE':
    return state.filter(({ _id }) => _id !== action.payload )
```

update new item to state array

```js
// First way
case "EDIT":
    return state.slice(0, index)
                .concat([{id: "id", value: "newValue"}])
                .slice(index + 1);
// Second way
case "EDIT":
    return state.map((item) => {
        if (item.id === "id") {
            return {
                ...item, 
                value: "newValue"
            }
        } else {
            return item;
        }
    })    
```