/**
 * 这是redux作者的简化版的redux：
 * https://gist.github.com/gaearon/ffd88b0e4f00b22c3159
 * 注释：acky.guo
 */


/**
 * 从函数名就可以看出这个函数的作用，基本是数组的map的对象版本，返回value映射后的对象
 * 例子：
 * var a = {
 *      name: 'acky',
 *      gender: 'male'
 * }
 * mapValues(a, value => value.toUpperCase()) ===> { name: 'ACKY', gender: 'MALE' }
 */
function mapValues(obj, fn) {
  return Object.keys(obj).reduce((result, key) => {
    result[key] = fn(obj[key], key);
    return result;
  }, {});
}

/**
 * 这个函数的作用是从对象中选出符合要求的值，然后返回，相当于数组的filter
 * 例子：
 * var a = {
 *      name: 'acky',
 *      age: 18,
 *      gender: 'male'
 * }
 * pick(a, value => typeof value === 'number') ===> { age: 18 }
 */
function pick(obj, fn) {
  return Object.keys(obj).reduce((result, key) => {
    if (fn(obj[key])) {
      result[key] = obj[key];
    }
    return result;
  }, {});
}

/**
 * bindActionCreators里面对每个action creator调用的逻辑，主要作用就是封装dispatch action的细节
 * 例子：
 * const test = bindActionCreator(() => ({ type: 'TEST' }), dispatch)
 * test() ===> 对action creator封装，调用的时候更直观和简便
 */
function bindActionCreator(actionCreator, dispatch) {
  return (...args) => dispatch(actionCreator(...args));
}

/**
 * 这个函数的作用就是把对象中的值通过bindActionCreator映射成绑定好dispatch的函数，
 * 可以理解为[ac1, ac2].map(ac => bindActionCreator(actionCreator, dispatch))，只不过数组换成了对象，
 * 但参数是函数的时候直接调用👆bindActionCreator
 */
export function bindActionCreators(actionCreators, dispatch) {
  return typeof actionCreators === 'function' ?
    bindActionCreator(actionCreators, dispatch) :
    mapValues(actionCreators, actionCreator =>
      bindActionCreator(actionCreator, dispatch)
    );
}

/**
 * 把a(b(c()))变成compose(a, b, c)，主要用来实现middleware chain
 */
export function compose(...funcs) {
  return arg => funcs.reduceRight((composed, f) => f(composed), arg);
}


export function applyMiddleware(...middlewares) {
    /**
     * applyMiddleWare的调用方式其实这样的，
     * applyMiddleware(...[mw1, mw2, mw3])(createStore)，
     * 返回的结果就是包装过的createStore
     */
  return (next) => (reducer, initialState) => {
    /**
     * next其实就是createStore，在内部创建store，拿到dispatch，使用中间件修改后返回
     */
    var store = next(reducer, initialState);
    var dispatch = store.dispatch;
    var chain = [];

    /**
     * middleware的设计是这样的：
     * const logger = ({ dispatch, getState}) => next => action => {
     *      //do something
     *      return next(action)
     * }
     * 所以此时chain里中间件就是next => action => {}，这样的函数
     * chain: 
     * [mw1, mw2, mw3]
     * compose(...chain) 相当于 mw1(mw2(mw3()))
     * 所以mw3 = store.dispatch => action => {}
     * mw2 = mw3() => action => {}
     * mw1 = mw2() => action => {}
     * 最终 dispatch = mw1()
     * 其实就是 dispatch = action => {}，又回到最开始dispatch的调用方式
     * 就是一层一层往store.dispatch上修正
     */
    chain = middlewares.map(middleware => middleware({
      getState: store.getState,
      dispatch: (action) => dispatch(action)
    }));
    dispatch = compose(...chain)(store.dispatch);
    /**
     * 返回的其实就是Redux.creatorStore()创造的store对象，但是dispatch是经过中间件修改过后的
     */
    return { ...store, dispatch };
  };
}

export function combineReducers(reducers) {
  /**
   * 第一步先过滤出有效的reducer，即value为function的key
   */  
  var finalReducers = pick(reducers, (val) => typeof val === 'function');
  return (state = {}, action) => mapValues(finalReducers,
  /**
   * 例子：
   * reducer = {
   *    product: productReducer,
   *    user: userReducer
   * }
   * 以key和action作为参数调用productReducer
   */
    (reducer, key) => reducer(state[key], action)
  );
}

export function createStore(reducer, initialState) {
  var currentReducer = reducer;
  var currentState = initialState;
  var listeners = [];
  var isDispatching = false;

  function getState() {
    return currentState;
  }

  function subscribe(listener) {
    listeners.push(listener);

    return function unsubscribe() {
      var index = listeners.indexOf(listener);
      listeners.splice(index, 1);
    };
  }

  function dispatch(action) {
    if (isDispatching) {
      throw new Error('Reducers may not dispatch actions.');
    }

    try {
      isDispatching = true;
      currentState = currentReducer(currentState, action);
    } finally {
      isDispatching = false;
    }

    listeners.slice().forEach(listener => listener());
    return action;
  }

  function replaceReducer(nextReducer) {
    currentReducer = nextReducer;
    dispatch({ type: '@@redux/INIT' });
  }

  dispatch({ type: '@@redux/INIT' });

  return { dispatch, subscribe, getState, replaceReducer };
}