### 背景

> 每一次在实现某个需求后，为了建立起详细的数据模型以便对客户的喜好进行分析，都会根据相应的埋点文档进行数据上报。这个时候因为目的性不同，往往使用的埋点方式也不尽相同。

## 什么是埋点

埋点，它的学名是事件追踪（Event Tracking），主要是针对特定用户行为或业务过程进行捕获、处理和发送的相关技术及实施过程。埋点是数据领域的一个专业术语，也是互联网领域的一个俗称。

埋点是产品数据分析的基础，一般用于推荐系统的反馈、用户行为的监控和分析、新功能或者运营活动效果的统计分析等。

埋点包含两个重要概念：事件（event），属性（param）

- 事件（event）：应用中发生了什么，例如用户操作、系统事件或系统错误。以你拍一产品为例，包含以下事件：enter_page（进入页面）、leave_page（离开页面）。
- 属性（param）：为了描述用户群细分而定义的属性，例如语言偏好或地理位置。以“进入课后练习”事件为例，它包含如下事件属性：enter_from（从哪个页面来），class_id（课程id）等。
- 属性值（value）：属性的维度，即行为触发时的具体维度。例如：enter_from：home（主页）、system（系统）等。

**主流方案**

+ 无痕埋点（全埋点），利用浏览器或APP自带的监听方式，对用户的浏览页面、点击等行为进行收集，一般用于粗颗粒度的数据分析，例如公司的slardar

  - 数据噪声大，不管有用没有，数据都会被收集
  - 无法定制化埋点，无法采集到指定事件和业务属性
  - 可供DA使用的信息较少
  - 接入简单，几乎无侵入，不需要额外的开发成本
  - 用户操作行为收集非常完整，几乎不会遗漏

+ 代码埋点，前端开发人员在代码中自定义监听和收集

  - 工作量大，而且对代码侵入性很大，后期维护也不是很方便
  - 可以精确埋点，具备明确的事件标识
  - 业务属性非常丰富
  - 埋点触发方式可以灵活定义
  - DA使用更方便和精确

+ 埋点sdk，sdk向外暴露上报埋点的接口，监听和收集过程开发人员无感知。例如神策埋点

  - 暂时想不到
  - 业务开发只需关注事件标识、业务属性等
  - 兼顾无痕埋点优点和代码埋点的优势

### 常见埋点属性

通常前端是按照页面维度统计埋点的，常见的事件属性如下：

| 属性       | 描述                                                         |
| ---------- | ------------------------------------------------------------ |
| uid        | 用户id，若用户未登陆，则返回特定标识id                       |
| url        | 当前事件触发页面的url                                        |
| eventTime  | 触发埋点的时间戳                                             |
| localTime  | 触发埋点时的用户本地时间，使用标准YYYY-MM-DD HH:mm:ss格式表示，方便后期直接使用字符串查询 |
| deviceType | 当前用户使用的设备类型，比如apple、三星、chrome等            |
| deviceId   | 当前用户使用的设备id                                         |
| osType     | 当前用户使用的系统类型，比如windows、macos、ios、android等   |
| osVersion  | 当前用户使用的系统版本                                       |
| appVersion | 当前应用版本                                                 |
| appId      | 当前应用id                                                   |
| extra      | 自定义数据，一般是序列化的字符串，且数据结构应保持稳定       |

### **常见埋点事件**

| 事件     | 上报时机                   | 描述                                   |
| -------- | -------------------------- | -------------------------------------- |
| 页面停留 | 当前页面切换或者页面卸载时 | 记录前一页浏览时间                     |
| pv       | 进入页面时                 | 页面访问次数，uv只需要根据deviceId过滤 |
| 交互事件 | 用户交互事件触发时         | 比如点击、长按等                       |
| 逻辑事件 | 符合逻辑条件时             | 比如登陆、跳转页面等                   |

## 错误数据采集方案

目前所能捕捉的错误有三种:

- 资源加载错误，通过 `addEventListener('error', callback, true) `在捕获阶段捕捉资源加载失败错误。

- js 执行错误，通过 `window.onerror `捕捉 js 错误。

- - 跨域的脚本会给出 "Script Error." 提示，拿不到具体的错误信息和堆栈信息。此时需要在script标签增加`crossorigin="anonymous"`属性，同时资源服务器需要增加CORS相关配置，比如`Access-Control-Allow-Origin: *`

- promise 错误，通过 `addEventListener('unhandledrejection', callback)`捕捉 promise 错误，但是没有发生错误的行数，列数等信息，只能手动抛出相关错误信息。

```javascript
// 在捕获阶段，捕获资源加载失败错误
addEventListener('error', e => {
    const target = e.target
    if (target != window) {
        monitor.errors.push({
            type: target.localName,
            url: target.src || target.href,
            msg: (target.src || target.href) + ' is load error',
            time: Date.now()
        })
    }
}, true)

// 监听 js 错误
window.onerror = function(msg, url, row, col, error) {
    monitor.errors.push({
        type: 'javascript',
        row: row,
        col: col,
        msg: error && error.stack? error.stack : msg,
        url: url,
        time: Date.now()
    })
}

// 监听 promise 错误 缺点是获取不到行数数据
addEventListener('unhandledrejection', e => {
    monitor.errors.push({
        type: 'promise',
        msg: (e.reason && e.reason.msg) || e.reason || '',
        time: Date.now()
    })
})
```

## 数据上报方案

在这个场景中，需要考虑两个问题：

- 如果数据上报接口与业务系统使用同一域名，浏览器对请求并发量有限制，所以存在网络资源竞争的可能性。
- 浏览器通常在页面卸载时会忽略异步ajax请求，如果需要必须进行数据请求，一般在unload或者beforeunload事件中创建同步ajax请求，以此延迟页面卸载。从用户侧角度，就是页面跳转变慢。

## 总结

不管白猫黑猫抓到老鼠就是好猫，用适合自己的方法解决问题就行。我司采用的埋点方案是借鉴于神策埋点。发布了一个依赖包，里面封装了不同场景下需要使用的方法，利用请求来完成想要的数据上报。



**参考：**

[前端埋点与监控方案](https://juejin.cn/post/6938075086737899534)

