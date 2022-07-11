# 框架设计概览

## 1、权衡的艺术

> 框架设计里到处都体现了权衡的艺术

### 1-1、命令式和声明式

命令式--命令式框架的一大特点就是关注过程

````javascript
//获取id为app的div标签
//它的文本内容为 hello world
//为其绑定点击事件
//当点击时弹出提示： ok
````

对应的代码为：

````javascript
$('#app')
	.text('hello world')  //设置文本内容
	.on('click', () => { alert('ok') }) //绑定点击事件
````

以上就是jQuery的代码示例， 此处再使用原生javascript实现同样的功能：

````javascript
const div = document.querySelector('#app') //获取div
div.innerText = 'hello world' //设置文本内容
div.addEventListener('click', () => { alert('ok') }) //绑定点击事件
````

声明式--与命令式框架更关注过程不同，声明式框架更加**关注结果**。结合vue.js，我们来看看如何实现上面自然语言描述的功能：

````vue
<div @click="() => alert('ok')">hello world</div>
````

这段类HTML的模版就是Vue.js实现如上功能的方式。换句话说Vue.js帮我们封装了**过程**。因此，我们能够猜到Vue.js的内部实现一定是**命令式**的，而暴露给用户的却更加**声明式**。

### 1-2、性能与可维护性的权衡

