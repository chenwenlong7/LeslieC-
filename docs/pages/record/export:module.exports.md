> 自从最近有一两个不难的需求是因为自己的知识体系不牢固导致完成的很艰难的时候，就下定决心🙅‍♂️拒绝做一个api caller。既然想要巩固知识体系就要研究底层，透过现象看本质，知其所以然。

## 1.是什么？

`提到exports和export就不得不提到模块化了`

### 1-1. 什么是模块化？

早期 JavaScript 开发很容易存在**全局污染**和**依赖管理**混乱问题。这些问题在多人开发前端应用的情况下变得更加棘手。我这里例举一个很常见的场景：

````html
<body>
  <script src="./index.js"></script>
  <script src="./home.js"></script>
  <script src="./list.js"></script>
</body>
````

如上在没有模块化的前提下，如果在 `html` 中这么写，那么就会暴露一系列问题。

- **全局污染**

没有模块化，那么 `script` 内部的变量是可以相互污染的。比如有一种场景，如上 `./index.js` 文件和 `./list.js` 文件为小 A 开发的，`./home.js` 为小 B 开发的。

小 A 在 `index.js`中声明 name 属性是一个字符串。

````javascript
var name = '试试就试试'
````

然后小 A 在 `list.js` 中，引用 name 属性

````javascript
console.log(name)
````

![image-20220515171921051](https://raw.githubusercontent.com/chenwenlong7/blog-resource/master/images/image-20220515171921051.png)

打印却发现 name 竟然变成了一个函数。刚开始小 A 不知所措，后来发现在小 B 开发的 `home.js` 文件中这么写道：

```javascript
function name(){
    //...
}
```

而且这个 name 方法被引用了多次，导致一系列的连锁反应。

上述例子就是没有使用模块化开发，造成的全局污染的问题，每个加载的 js 文件都共享变量。当然在实际的项目开发中，可以使用匿名函数自执行的方式，形成独立的块级作用域解决这个问题。

所以就需要模块化来解决上述的问题，今天我们就重点讲解一下前端模块化的两个重要方案：**Commonjs** 和 **Es Module**

### 1-2.exports 和 module.exports

`Commonjs` 的提出，弥补 Javascript 对于模块化，没有统一标准的缺陷。nodejs 借鉴了 `Commonjs` 的 Module ，实现了良好的模块化管理。

而exports 和 module.exports就是commonjs的其中两个变量

#### exports 使用

**第一种方式：exports** `a.js`

````javascript
exports.name = `《我就试试哦》`
exports.author = `Leslie`
exports.say = function (){
    console.log(777)
}
````

**引用**

````javascript
const a = require('./a')
console.log(a)
````

**打印结果：**

![image-20220515231807089](https://raw.githubusercontent.com/chenwenlong7/blog-resource/master/images/image-20220515231807089.png)

#### module.exports 使用

module.exports 本质上就是 exports ，我们用 module.exports 来实现如上的导出。

````javascript
module.exports ={
    name:'《我就试试哦》',
    author:'leslie',
    say(){
        console.log(777)
    }
}
````

module.exports 也可以单独导出一个函数或者一个类。比如如下：

````javascript
module.exports = function (){
    // ...
}
````

从上述 `require` 原理实现中，我们知道了 exports 和 module.exports 持有相同引用，因为最后导出的是 module.exports 。那么这就说明在一个文件中，我们最好选择 `exports` 和 `module.exports` 两者之一，如果两者同时存在，很可能会造成覆盖的情况发生。比如如下情况：

```javascript
exports.name = 'leslie' // 此时 exports.name 是无效的
module.exports ={
    name:'《我就试试哦》',
    author:'LeslieC',
    say(){
        console.log(777)
    }
}
```

上述情况下 exports.name 无效，会被 `module.exports` 覆盖。

#### Q & A

1 那么问题来了？ **既然有了 `exports`，为何又出了 `module.exports `?**

答：如果我们不想在 commonjs 中导出对象，而是只导出一个**类或者一个函数**再或者其他属性的情况，那么 `module.exports` 就更方便了，如上我们知道 `exports` 会被初始化成一个对象，也就是我们只能在对象上绑定属性，但是我们可以通过 `module.exports` 自定义导出出对象外的其他类型元素。

```javascript
let a = 1
module.exports = a // 导出函数

module.exports = [1,2,3] // 导出数组

module.exports = function(){} //导出方法
```

2 与 `exports` 相比，`module.exports` 有什么缺陷 ？

答：`module.exports` 当导出一些函数等非对象属性的时候，也有一些风险，就比如循环引用的情况下。对象会保留相同的内存地址，就算一些属性是后绑定的，也能间接通过异步形式访问到。但是如果 module.exports 为一个非对象其他属性类型，在循环引用的时候，就容易造成属性丢失的情况发生了。

### 1-3.导出 export 和导入 import

所有通过 export 导出的属性，在 import 中可以通过结构的方式，解构出来。

**export 正常导出，import 导入**

导出模块：`a.js`

```javascript
const name = '《我就试试哦》' 
const author = 'Leslie'
export { name, author }
export const say = function (){
    console.log('hello , world')
}
```

导入模块：`main.js`

```javascript
// name , author , say 对应 a.js 中的  name , author , say
import { name , author , say } from './a.js'
```

- export { }， 与变量名绑定，命名导出。
- import { } from 'module'， 导入 `module` 的命名导出 ，module 为如上的 `./a.js`
- 这种情况下 import { } 内部的变量名称，要与 export { } 完全匹配。

**默认导出 export default**

导出模块：`a.js`

```javascript
const name = '《我就试试哦》'
const author = 'Leslie'
const say = function (){
    console.log('hello , world')
}
export default {
    name,
    author,
    say
} 
```

导入模块：`main.js`

```javascript
import mes from './a.js'
console.log(mes) //{ name: '《我就试试哦》',author:'Leslie', say:Function }
```

- `export default anything` 导入 module 的默认导出。 `anything` 可以是函数，属性方法，或者对象。
- 对于引入默认导出的模块，`import anyName from 'module'`， anyName 可以是自定义名称。

## 2.区别

### 2-1.Commonjs

`Commonjs` 的特性如下：

- CommonJS 模块由 JS 运行时实现。
- CommonJs 是单个值导出，本质上导出的就是 exports 属性。
- CommonJS 是可以动态加载的，对每一个加载都存在缓存，可以有效的解决循环引用问题。
- CommonJS 模块同步加载并执行模块文件。

### 2-2.es module

`Es module` 的特性如下：

- ES6 Module 静态的，不能放在块级作用域内，代码发生在编译时。
- ES6 Module 的值是动态绑定的，可以通过导出方法修改，可以直接访问修改结果。
- ES6 Module 可以导出多个属性和方法，可以单个导入导出，混合导入导出。
- ES6 模块提前加载并执行模块文件，
- ES6 Module 导入模块在严格模式下。
- ES6 Module 的特性可以很容易实现 Tree Shaking 和 Code Splitting。



## 3.总结

ES6 module 和 Common.js 一样，对于相同的 js 文件，会保存静态属性。

但是与 Common.js 不同的是 ，`CommonJS ` 模块同步加载并执行模块文件，ES6 模块提前加载并执行模块文件，ES6 模块在预处理阶段分析模块依赖，在执行阶段执行模块，两个阶段都采用深度优先遍历，执行顺序是子 -> 父。ES6 module中的import和export更符合现在的开发场景，所以也应用的更加广泛。



## 参考：

[深入浅出 Commonjs 和 Es Module](https://juejin.cn/user/1257497032133597/posts)

