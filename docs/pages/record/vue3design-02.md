## 1.什么是响应式？

**响应式就是被观察的数据变化的时候做一系列联动处理。**



### 1-1.响应式数据与副作用函数

副作用函数指的是会产生副作用的函数，如下面的代码所示：

````javascript
function effect() {
  document.body.innerText = 'hello world'
}
````

上述的代码表示，当effect函数执行时，它会设置body的文本内容，但除了effect函数之外的任何函数都可以读取或设置body的文本内容。也就是说，effect函数的执行会直接或间接影响其他函数的执行。

### 1-2.响应式数据的基本实现

> 如何才能让obj变成响应式数据呢？

+ 当副作用函数effect执行时，会触发字段obj.text的读取操作;
+ 当修改obj.text的值时，会触发字段obj.text的设置操作;