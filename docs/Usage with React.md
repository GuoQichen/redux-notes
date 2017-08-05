# Usage with React

从一开始，我们就强调Redux和React没有关系。你可以写Redux apps使用React，Angular，Ember，jQuery，或者valilla javascript

即便如此，Redux特别契合像React以及Deku，因为这些框架让你用带状态的函数描述UI，然后使用Redux更新状态来响应用户的交互

我们将使用React来构建简单的todo app

## Installing React Redux

Redux默认不包含React binding。你需要自己安装

```
npm install --save react-redux
```
如果你不使用npm，你可以从unpkg获取最新的使用UMD构建的版本（包括开发和生产构建）。如果你在页面中通过`<script>`引入，UMD构建的版本会暴露一个全局的变量`window.ReactRedux`

## Presentational and Container Components

Redux的React binding库拥抱UI组件和容器组件分离的理念，如果你对这些术语不熟悉，先阅读[这篇文章](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)，然后再回来，因为这些很重要，所以我们会等你

读完了吗？让我们重新看看一下两种组件的不同之处

<table>
    <thead>
        <tr>
            <th></th>
            <th scope="col" style="text-align:left">Presentational Components</th>
            <th scope="col" style="text-align:left">Container Components</th>
        </tr>
    </thead>
    <tbody>
        <tr>
          <th scope="row" style="text-align:right">Purpose</th>
          <td>How things look (markup, styles)</td>
          <td>How things work (data fetching, state updates)</td>
        </tr>
        <tr>
          <th scope="row" style="text-align:right">Aware of Redux</th>
          <td>No</th>
          <td>Yes</th>
        </tr>
        <tr>
          <th scope="row" style="text-align:right">To read data</th>
          <td>Read data from props</td>
          <td>Subscribe to Redux state</td>
        </tr>
        <tr>
          <th scope="row" style="text-align:right">To change data</th>
          <td>Invoke callbacks from props</td>
          <td>Dispatch Redux actions</td>
        </tr>
        <tr>
          <th scope="row" style="text-align:right">Are written</th>
          <td>By hand</td>
          <td>Usually generated by React Redux</td>
        </tr>
    </tbody>
</table>

大部分我们写的组件用来展示，但是我们也需要容器组件把他们和Redux联系起来。这和下面的设计简洁并不以为着组件容器必须靠近组件树的顶部。如果一个容器组件变得太复杂（例如，他有很深的UI组件嵌套以及数不清的回调函数从组件树往下传递），在组件树中引进另外一个容器组件值得注意

从技术上来说你可以使用`store.subscribe()`来自己写容器组件。但是我们不建议你这样做因为React Redux做了许多性能上的优化。鉴于这个原因，我们不会自己写容器组件，而是使用React Redux提供的`connect()`，就像你在下面看到的一样

## Designing Component Hierarchy

还记得我们如何设计the shape of root state object吗，是时候设计匹配它的UI层级结构了。这不是Redux的任务。think in react是解释这个过程的一个很好的教程（在React官方文档中）

我们的设计摘要是简单的。我们想要展示一个todo items的列表。点击后，一个todo被划掉标记为完成。我们想要展示一个用户添加新的todo的地方。在底部，我们想要展示一个toggle来切换show all，only completed，only active todos

### Designing Presentational Components