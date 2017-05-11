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
`store.dispatch(addTodo('Use Redux'))`  
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