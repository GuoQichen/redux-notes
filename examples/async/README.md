# async example 
这个例子主要介绍了如何使用thunk处理redux的异步场景

## usage
```
yarn install
yarn start
```

## analysis
1. thunk
	
	thunk一开始的起源是函数参数的求值策略，分别是传值调用和传名调用，JS中使用的是传值调用，thunk函数就是传名调用的实现方式，本质就是延迟表达式的调用时。异步的业务场景一般需要保存三个状态，分别是异步的请求发起的时候，UI显示loading状态，然后是请求成功和请求失败的状态，redux中使用thunk延迟dispatch action，在请求开始的时候dispatch一个请求发起的action，然后在异步的回调函数中dispatch成功和失败的action

2. 主要逻辑

	这个例子的主要的逻辑都在`/src/container/App.js`中，从life cycle开始看。
	
	在`componentDidMount`的时候dispatch一个获取post的方法`fetchPostsIfNeeded`  

	```js
	export const fetchPostsIfNeeded = reddit => (dispatch, getState) => {
		if (shouldFetchPosts(getState(), reddit)) {
			return dispatch(fetchPosts(reddit))
		}
	}
	```
	这个方法的逻辑分成两部分，一部分是是否有必要获取数据，另一部分是单纯的异步获取数据的请求，这个函数分成两部分达到了关注点分离的效果，是否有必要获取数据可以根据业务场景来扩展，例如，有一个用户手动刷新post的需求，那么只需要把fetch修改成need就可以，而不需要修改其他代码

	```js
	const shouldFetchPosts = (state, reddit) => {
		const posts = state.postsByReddit[reddit]
		if (!posts) {
			return true
		}
		if (posts.isFetching) {
			return false
		}
		return posts.didInvalidate
	}	
	```
	这个方法就是是否有必要获取数据的封装，如果切换的reddit没有的话，那么就需要获取，如果在获取中就不再获取，这里对用户刷新的做法是，用户刷新的刷新的时候，就把当前的reddit标记成无效的，然后重新获取

	```js
	const fetchPosts = reddit => dispatch => {
		dispatch(requestPosts(reddit))
		return fetch(`https://www.reddit.com/r/${reddit}.json`)
			.then(response => response.json())
			.then(json => dispatch(receivePosts(reddit, json)))
	}	
	```
	这个方法就是单纯的获取数据，不参杂业务逻辑，`/src/action/index.js`文件中的action的主要内容就是这些，剩下的就是简单的action creator

	回到App的life cycle中，`componentWillReceiveProps`中的逻辑主要是切换reddit的时候判断是非需要异步请求获取数据，如果需要，就会走`fetchPostsIfNeeded`的逻辑，如果不需要，就什么也不做，但是因为props改变，组件update，post更新到对应的reddit，那么这个从改变reddit到post响应更新是如何实现的呢

	因为使用redux做状态管理，使用`react-redux`来链接store，通过dispatch action来改变store的状态，然后通过provider传递到UI组件，在App文件的最下方，我们可以看到链接的逻辑

	```js
	const mapStateToProps = state => {
		const { selectedReddit, postsByReddit } = state
		const {
			isFetching,
			lastUpdated,
			items: posts
		} = postsByReddit[selectedReddit] || {
			isFetching: true,
			items: []
		}
		return {
			selectedReddit,
			posts,
			isFetching,
			lastUpdated
		}
	}
	export default connect(mapStateToProps)(App)		
	```
	使用`react-redux`提供的connect来链接UI组件和store，connect接受两个参数
	
	一个是store中的state到UI组件的props的映射，另一个是action到props的映射
	
	第一个参数是一个函数，接收state返回props
	
	第二个参数可以是一个函数，也可以是一个对象，甚至可以为空，当作为函数的时候和第一个参数的时候方法一样，接收dispatch作为参数，然后返回props，作为对象的时候，就会调用redux的bindActionCreator方法，如果为空就会把dispatch作为props传递进UI组件

	然后在state到prop的映射中，返回的post永远是`postsByReddit[selectedReddit]`, 也就是根据选择好的reddit来选择对应posts，所以业务逻辑与用户的交互中只需要修改`selectedReddit`，修改后组件触发`componentWillReceiveProps`，然后触发`fetchPostsIfNeeded`，然后去判断是否需要获取post，如果不需要，就可以直接从缓存中的post中拿到对应reddit的post

	```js
	handleChange = nextReddit => {
		this.props.dispatch(selectReddit(nextReddit))
	}	
	```
	`handleChange`就是切换reddit的用户交互，这边使用了stage2的class property，需要使用babel的plugin，`Class properties transform`，这样写是因为在react中简化jsx的this绑定，如果使用arrow function，每次render都要生成新的函数，照成不必要的内存空间的浪费，如果每次bind也一样，如果在构造函数中bind，写法也不够简洁，使用class property和arrow function的写法就不需要再绑定this

	然后在往下看，就是用户更新的交互方法

	```js
	handleRefreshClick = e => {
		e.preventDefault()
		const { dispatch, selectedReddit } = this.props
		dispatch(invalidateReddit(selectedReddit))
		dispatch(fetchPostsIfNeeded(selectedReddit))
	}	
	```
	这个方法的逻辑就像我们之前说过的那样，把reddit的valid修改为false，然后再调用`fetchPostsIfNeeded`

3. 总结

	整体的业务逻辑非常清晰，灵活利用组件的life cycle和container组件来实现业务逻辑也值得多多练习，在实际的业务场景中，例如分类商品的展示，也可以这样设计，显示的商品就是`product[selecttedCategory]`，然后在组件的lify cycle中的`componentWillReceivePorps`中，当`category`改变，且`category`对应的product是没有的，才去向服务器获取product，否则使用缓存的product