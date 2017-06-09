# redux-note
这是个人学习reduce的笔记

- [主要笔记部分](https://github.com/GuoQichen/redux-notes/tree/master/docs)

    主要笔记放在docs中，现在包括：
    
    - [applyMiddleware的翻译](https://github.com/GuoQichen/redux-notes/blob/master/docs/applyMiddleware.md)

        applyMiddleware文档的翻译，这边很好的解释了中间件的由来和设计思想
    - [redux api overview](https://github.com/GuoQichen/redux-notes/blob/master/docs/overview.md)

        包括redux的工具函数和creatStore创建的store实例上的api
    - [redux applyMiddleware with example](https://github.com/GuoQichen/redux-notes/blob/master/docs/middleware-analysis.md)

        从中间件的调用开始，一步步看applyMiddeware到底做了什么，包括redux-thunk做了什么
    - [simply redux annotation](https://github.com/GuoQichen/redux-notes/blob/master/docs/simple-redux-annotation.js)

        simply-redux是redux作者写的只有99行的简版redux，剥离了一些提示和错误判断，保留主要逻辑，这个笔记主要是对simple-redux的注释

- [demo部分](https://github.com/GuoQichen/redux-notes/tree/master/examples)

    主要是redux文档提供的几个例子的解析，从这些例子中能很好的学到redux的最佳实践和如何在业务逻辑中灵活运用：

    - [shopping-car](https://github.com/GuoQichen/redux-notes/tree/master/examples/shopping-cart)

        购物车的例子，作者通过这个例子介绍了state的设计思想

    - [async](https://github.com/GuoQichen/redux-notes/tree/master/examples/async)

        异步的例子，作者介绍了如何使用redux-thunk和redux如何实现异步的业务场景

- 动手测试redux

    直接在根目录使用就能动手测试redux的api

    ```js
    yarn start
    // or npm start
    ```

    注意，其实redux和react无关，这么说是为了说明redux只是数据的一套管理方案，操作的其实只是js对象，所以不需要DOM也能使用，在根目录的`index.js`文件中你可以直接测试