# Middleware

## 中间件概念介绍
在Node的框架Express和Koa中，已经有了中间件的概念，在Express和Koa中，中间件其实是一段放在接收请求和生成响应之间的代码，例如，Express和Koa的中间件可以添加CORS报文头，打印日志，压缩等等，中间件最有用的特性在于可以组成一个中间件链(middleware chain)，你就可以在一个项目中使用多个第三方独立的中间件

Redux的中间虽然和Express和Koa的中间件解决不同的问题，但是概念上是相似的。Redux的中间件在dispatch一个action和reducer接收到action之间提供一个接口，允许接入第三方的扩展。人们用Redux中间件来打印日志，app的崩溃报告，与异步API通信，路由等等

## 理解中间件
因为中间件可以被用来做许多事，包括异步API调用，所以理解中间件是怎么来的非常重要。我们将以打印日志和崩溃报告为例来带你理解编写appyMiddleware的思考过程

## 问题：打印日志
Redux的优势之一是state的改变是可预测和透明的，每次dispatch一个action，新的state被计算和保存。state不能自己改变，只能通过一系列指定的action来改变

如果我们能在每个action发生的时候打印日志和打印action发生之后的state，这不是很完美嘛？当发生错误的时候，我们可以回顾我们的日志，弄清哪个action破坏了state

那么我们如何在Redux中实现呢？

## 尝试#1: 手动打印
最原始的方法就是每次调用`store.dispatch(action)`的时候去手动打印action和下一个state。虽然这不是一个真正的解决方案，但是这是理解问题的第一步

假设，当你想创建一个todo的时候可以这样调用:  
```js
store.dispatch(addTodo('Use Redux'))
```  
如果要打印action和state，你可以把这段代码编程这样:  
```js
let action = addTodo('Use Redux')
console.log('dispatching', action)
store.dispatch(action)
console.log('next state', store.getState())
```  
虽然这达到了我们想要的效果，但是你肯定不想每次都这样  

## 尝试#2: 包装dispatch
你可以把打印日志的逻辑放在一个function中:  
```js
function dispatchAndLog(store, action) {
    console.log('dispatching', action)
    store.dispatch(action)
    console.log('next state', store.getState())
}
```  
然后你可以每次使用这个function代替`store.dispatch()`  
```js
dispatchAndLog(store, addTodo('Use Redux'))`
```  
我们虽然完成了，但是每次都需要import一个特殊的function不是非常的方便  

## 尝试#3: Monkeypatching Dispatch
（Monkeypatch: Monkeypath指的是运行时动态替换，一般是在startup的时候，之后的代码就调用替换后的函数)  

如果我们在store上把dispatch替换掉会怎么样？其实Redux的store只是一个带有一些方法的对象（意思是在对象的方法中不使用this，所以替换不会发生问题），而且js也允许这样，所以我们使用Monkeypatch来重新实现dispatch:  
```js
let next = store.dispatch
store.dispatch = function dispatchAndLog(action) {
    console.log('dispatching', action)
    let result = next(action)
    console.log('next state', store.getState())
    return result
}
```  
这已经离我们想要的更近一步了，不管什么时候我们dispatch一个action，它都能保证action被打印。Monkeypatching感觉也不是一个好的做法，但是我们暂时先这样做

## 问题：崩溃报告
如果我们想在dispatch上用多个类似打印日志这样的转化function怎么办呢

另一个有用的转化function进入我的脑海中，就是在生产环境报告js的错误。全局的`window.onerror`事件是不可靠的因为它在一些老的浏览器没有错误堆栈的信息，这对于理解错误是如何产生的至关重要

如果任何时候dispatch一个action抛出错误，我们会发送带有错误堆栈信息到崩溃报告服务器，例如Sentry，这个信息包括，哪个action导致了这个错误，当前的状态是怎样的？这样在开发环境重现错误就会更容易

然而，保持打印日志和崩溃报告分离是很重要的。理想状态我们希望它们能在不同的模块，可能是在不同的包中。否则我们就不能构建起中间件的生态系统

如果打印日志和崩溃报告是分离的工具，它们可能这样:  
```js
function patchStoreToAddLogging(store) {
    let next = store.dispatch
    store.dispatch = function dispatchAndLog(action) {
        console.log('dispatching', action)
        let result = next(action)
        console.log('next state', store.getState())
        return result // 为了和native dispatch行为保持一致，store.dispatch() return action
    }
}
function patchStoreToAddCrashReporting(store) {
    let next = store.dispatch // 此时的store.dispatch已经是经过loggin包装过的函数dispatchAndLog
    store.dispatch = function dispatchAndReportErrors(action) {
        try {
            return next(action)
        } catch (err) {
            console.error('Caught an exception!', err)
            Raven.captureException(err, {
                extra: {
                    action,
                    state: store.getState()
                }
            })
            throw err
        }
    }
}
```  
如果这些函数作为分离的模块发布，我们之后就可以使用它们修补我们的store:  
```js
patchStoreToAddLogging(store)
patchStoreToAddCrashReporting(store)
```  
但是还不是非常完美

## 尝试#4：隐藏Monkeypatch
Monkeypatch是一种hack. "替换你喜欢的任何方法"，那是怎样的API？让我们弄清它的本质. 在之前，我们的函数替换`store.dispatch`. 如果我们返回新的`dispatch`函数代替会怎么样?  
```js
function logger(store) {
    let next = store.dispatch
    // Previously: 
    // store.dispatch = function dispatchAndLog(action) {
    return function dispatchAndLog(action) {
        console.log('dispatching', action)
        let result = next(action)
        console.log('next state', store.getState())
        return result
    }
}
```  
我们可以在Redux中提供一个辅助函数，它将实际的monkeypatch作为一个实现细节:  
```js
function applyMiddlewareByMonkeypatching(store, middlewares) {
    // 因为reverse()是一个in place操作，即在原数组上修改，为了每次得到正确的反序，所以copy一个原数组的浅拷贝副本
    middlewares = middlewares.slice()
    // 这里之所以reverse是因为函数的调用顺序和书写顺序是相反的，即先写的函数后调用
    // 例如：[logger, crashReport]，其实是logger patch store.disptch，然后crashReport再来patch前一个函数patch后的store.dispatch
    middlewares.reverse()
    // Transform dispatch function with each middleware
    middlewares.forEach(middleware => 
        // 这里的middleware(store)返回的是一个函数，这个函数其实是一个闭包
        // 这个闭包能访问next，也就是上一次的store.dispatch，然后再将store.dispatch替换掉
        store.dispatch = middleware(store)
    )
}
```  
我们使用这个函数来应用多个中间件，就像这样:  
```js
applyMiddlewareByMonkeypatching(store, [ logger, crashReport ])
```  
然而，这还是一个Monkeypatch  
事实是我们把Monkeypatch隐藏在我们的库中，但是实际上没有改变使用Monkeypatch的事实

## 尝试#5: 移除Monkeypatch
那我们为什么不直接重写`dispatch`呢？当然，是为了能够在中间件之后去调用，但是也有另外一个原因：这样每个中间件可以访问和调用前一个包装后的`store.dispatch`:  
```js
function logger(store) {
    // Must point to the fucntion returned by the previous middleware:
    let next = store.dispatch
    return function dispatchAndLog(action) {
        console.log('dispatching', action)
        let result = next(action)
        console.log('next state', store.getState())
        return result
    }
}
```  
他的本质是链式中间件！

如果`applyMiddlewareByMonkeypatching`在处理第一个中间件之后没有马上赋给`store.dispatch`，`store.dispatch`将继续指向原始的`dispatch`函数，然后第二个中间件也将被绑在原始的`dispatch`函数上(即不断把中间件赋给`store.dispatch`，利用闭包来访问前一次中间件)

除此之外还有另一种不同的方式实现链式调用. 中间件可以接受`next()`dispatch函数作为参数代替原来的从`store`实例中读取dispatch函数的方法  
```js
function logger(store) {
    return function wrapDispatchToAddLogging(next) {
        return function dispatchAndLog(action) {
            console.log('dispathing', action)
            let result = next(action)
            console.log('next state', store.getState())
            return result
        }
    }
}
```  
这是一个"we need to go deeper"的时刻，所以它可能多花一点时间去变得理解. 函数瀑布很吓人，ES6的箭头函数让currying看起来更简洁:  
```js
const logger = store => next => action => {
    console.log('dispatching', action)
    let result = next(action)
    console.log('next state', store.getState())
    return result
}
const crashReporter = store => next => action => {
    try {
        return next(action)
    } catch (err) {
        console.error('Caught an exception!', err)
        Raven.captureException(err, {
            extra: {
                action,
                state: store.getState()
            }
        })
        throw err
    }
}
```  
这是Redux中间件的样子.  

现在中间件接受`next()`dispatch函数，然后返回一个dispatch函数，它反过来作为`next()`到左边的中间件，等等. 访问一些store的方法，例如，`getState()`仍然很有用，因此store保留作为顶层参数

## 尝试#6: "单纯"的使用中间件
我们可以写第一个最终的，完全包装`dispatch()`的`applyMiddleware()`来代替`applyMiddlewareByMonkeypatching()`，然后返回使用这个函数的store的副本：  

```js
// Warning: Naïve implementation!
// That's *not* Redux API.
function applyMiddleware(store, middlewares) {
  middlewares = middlewares.slice()
  middlewares.reverse()
  let dispatch = store.dispatch
  middlewares.forEach(middleware =>
    dispatch = middleware(store)(dispatch)
  )
  return Object.assign({}, store, { dispatch })
}
```

` applyMiddleware()`的实现已经和Redux中非常接近了，但是有三个重要的不同之处：  
- redux源码中只暴露store的子集给middleware，`dispatch(action)`和`getState()`，实际在源码中只暴露这样一个对象：  

    ```js
    var middlewareAPI = {
        getState: store.getState,
        dispatch: (action) => dispatch(action)
    }
    ```
- 在你使用middlware调用`store.dispatch(action)`代替`next(action)`的时候使用了一些小技巧，这个行为其实便利再一次遍历middlware chain，包括当前的middleware. 这对于异步的middleware是有用的
- 为了确保你只调用middleware一次，它操作`createStore()`而不是`store`本身. 使用`(...middlewares) => (createStore) => createStore`代替`(store, middlewares) => store`

因为在使用`createStore()`之前使用`applyMiddleware()`太繁琐的，所以`createStore()`接受一个可选的最后一个参数作为`applyMiddleware()`

## 最后的实现
基于我们刚写的中间件：
```js
const logger = store => next => action => {
  console.log('dispatching', action)
  let result = next(action)
  console.log('next state', store.getState())
  return result
}
const crashReporter = store => next => action => {
  try {
    return next(action)
  } catch (err) {
    console.error('Caught an exception!', err)
    Raven.captureException(err, {
      extra: {
        action,
        state: store.getState()
      }
    })
    throw err
  }
}
```
这是如何在redux store中使用：
```js
import { createStore, combineReducers, applyMiddleware } from 'redux'
let todoApp = combineReducers(reducers)
let store = createStore(
  todoApp,
  // applyMiddleware() tells createStore() how to handle middleware
  applyMiddleware(logger, crashReporter)
)
```
就是这样，现在所有dispatch到这个store实例的action都会通过`logger`和`crashReporter`：
```js
// Will flow through both logger and crashReporter middleware!
store.dispatch(addTodo('Use Redux'))
```

## 七个例子

