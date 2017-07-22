# analysis middlware with example 

一开始，先假设我们有三个middleware，分别是mw1, mw2, mw3

```js
const mw1 = ({ dispatch, getState }) => next => action => {
	console.log('trigger middleware 1')
	return next(action)
}
const mw2 = ({ dispatch, getState }) => next => action => {
	console.log('trigger middleware 2')
	return next(action)
}
const mw3 = ({ dispatch, getState }) => next => action => {
	console.log('trigger middleware 3')
	return next(action)
}
```

然后，我们调用按1,2,3的顺序调用middleware

```js
mws = [mw1, mw2, mw3]
applyMiddleware(...mws)
```

我们现在来看看，到底applyMiddleware做了什么

其实，applyMiddleware的作用就是patch dispatch，主要分为两步，第一步，注入store的部分api

```js
const chain = mws.map(middleware => middleware({ dispatch, getState }))
compose(...chain)(store.dispatch)
```

第二步就是把注入好api的middleware使用compose结合起来，注意这边反着写是因为compose是从后往前

```js
const chain_3 = (next = store.dispatch) => action => {
	console.log('trigger middleware 3')
	return next(action)
}
// 为什么这边是composed_1，因为compose内部是reduceRight，是从后往前composed的
const chain_2 = (next = composed_1 = chain_3(store.dispatch)) => action => {
	console.log('trigger middleware 2')
	return next(action)
}
const chain_1 = (next = compsed_2 = chain_2(store.dispatch)) => action => {
	console.log('trigger middleware 1')
	return next(action)
}
```

其实组合后的函数展开就是这样，就是在原来的`store.dispatch`上补充

```js
const composed = action => {
	console.log('trigger middleware 1')
	return (action => {
		console.log('trigger middleware 2')
		return (action => {
			console.log('trigger middleware 3')
			return store.dispatch(action)
		})(action)
	})(action)
}
```

那么`redux-thunk`是又是怎么工作的呢

```js
// fetchSomething是一个异步api调用
dispatch(fetchSomething(id))
// 这是fetchSomething，使用了redux-thunk
const fetchSomething = (id) => (dispatch, getState) => {
	dispatch(get_request())
	fetch('api')
		.then(result => dispatch(get_successful(result.json()))
		.catch(err => dispatch(get_failure(err)))
}
// composed后的dispatch内部展开就是这样，关键在于if...else...的条件分发，是函数就走thunk的逻辑，不是函数就按照中间件往下走直到store.dispach
// 伪代码
const dispatch_composed = action => {
	console.log('trigger middleware 1')
	if (typeof action === 'function') {
		((dispatch, getState) => {
			dispatch(get_request())
			fetch('api')
				.then(result => dispatch(get_successful(result.json()))
				.catch(err => dispatch(get_failure(err)))
		})(dispatch, getState)
		// dispatch 和 getState 其实是从中间件注入的
	} else {
		return (action => {
			console.log('trigger middleware 2')
			return (action => {
				console.log('trigger middleware 3')
				return store.dispatch(action)
			})(action)
		})(action)
	}
}
```

## conclusion

```js
const mw1 = ({ dispatch, getState }) => next => action => {
	console.log('trigger middleware 1')
	return next(action)
}
const mw2 = ({ dispatch, getState }) => next => action => {
	console.log('trigger middleware 2')
	return next(action)
}
const mw3 = ({ dispatch, getState }) => next => action => {
	console.log('trigger middleware 3')
	return next(action)
}
```

这里面的next是什么？其实就是上一个中间件，为什么next是上一个呢？因为执行中间件的过程就是剥洋葱，从外到里，而patch dispatch的过程就是从里到外

```js
store.dispatch => mw1 => mw2 => mw3
```

最后的我们使用的`dispatch`其实就是mw3，mw3里面的next就是mw2，然后一直往前

记住，从前往后注入，从后往前执行



