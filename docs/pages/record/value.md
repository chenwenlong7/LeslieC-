---
title: 深入浅出组件传值
date: 2021-06-14 11:41:23
tags:
      - 学习
categories: 自我学习
---

## **Vue组件之间的通信方式**

### 1、子组件设置props + 父组件设置`v-bind:`/`:`

+ 父传子

### 2、子组件的$emit + 父组件设置`v-on`/`@`

+ 子传父

### 3、EventBus(事件总线)

> 在vue项目中，父子组件间的通讯很方便。但兄弟组件或多层嵌套组件间的通讯，就会比较麻烦。这时，使用eventBus通讯，就可以很便捷的解决这个问题。
>
>    eventBus可以在全局定义，实现全项目通讯，使用方法也很简单。

+ 1、初始化——全局定义

全局定义，可以将eventBus绑定到vue实例的原型上,也可以直接绑定到window对象上.

````javascript
//main.js
//方式一
Vue.prototype.$EventBus = new Vue();
//方式二
window.eventBus = new Vue();
````



+ 2、触发事件

````javascript
//使用方式一定义时
this.$EventBus.$emit('eventName', param1,param2,...)
//使用方式二定义时
EventBus.$emit('eventName', param1,param2,...)
````

+ 3、监听事件

````javascript
//使用方式一定义时
this.$EventBus.$on('eventName', (param1,param2,...)=>{
    //需要执行的代码
})
//使用方式二定义时
EventBus.$on('eventName', (param1,param2,...)=>{
    //需要执行的代码
})
````

+ 4、移除监听事件

`为了避免在监听时，事件被反复触发，通常需要在页面销毁时移除事件监听。或者在开发过程中，由于热更新，事件可能会被多次绑定监听，这时也需要移除事件监听。`

````javascript
//使用方式一定义时
this.$EventBus.$off('eventName');
//使用方式二定义时
EventBus.$off('eventName');
````

### 4、Vuex

+ 里面的属性有：

  + state
    + 存储数据的
    + 获取数据最好推荐使用getters
    + 硬要使用的话可以用MapState， 先引用，放在compute中`...mapState(['方法名','方法名'])`

  + getters
    + 获取数据的
    + this.$store.getters.xxx
    + 也可使用mapGetters 先引用，放在compute中，`...mapGetters(['方法名','方法名'])`

  + mutations
    + 同步操作数据的
    + this.$store.commit(“方法名”,数据)
    + 也可使用mapMutations ，使用方法和以上一样

  + actions
    + 异步操作数据的
    + this.$store.dispatch(“方法名”,数据)
    + 也可使用mapActions ，使用方法和以上一样

  + modules
    + 板块，里面可以放多个vuex

  

### 5、父组件通过`v-bind:`/`:`传值，子组件通过`this.$attrs`获取

+ 父传子
+ 当子组件没有设置props的时候可以使用
+ `this.$attrs`获取到的是一个对象（所有父组件传过来的集合）



### 6、祖先组件使用provide提供数据，子孙组件通过inject注入数据

**父组件**

````javascript
<template>
  <div>
    <h1>HelloWorld</h1>
    <One></One>
  </div>
</template>

<script>
import One from "./One";
export default {
  components: { One },
  // provide: {
  //   for: "这是父组件的provide"
  // }
  provide() {
    return {
      for: "这是父组件的provide"
    };
  }
};
</script>

````



**子组件1**

````javascript
<template>
  <div>
    <h2>childOne组件</h2>
    {{demo}}
    <Two></Two>
  </div>
</template>

<script>
import Two from "./Two.vue";
export default {
  name: "One",
  // inject: ["for"],
  inject: {
    for: {
      default: () => ({})
    }
  },
  data() {
    return {
      demo: this.for
    };
  },
  components: {
    Two
  }
};
</script>

````

**子组件2**

````javascript
<template>
  <div>
    <h2>childtwo组件</h2>
    {{demo}}
  </div>
</template>

<script>
export default {
  name: "Two",
  // inject: ["for"],
  inject: {
    for: {
      default: () => ({})
    }
  },
  data() {
    return {
      demo: this.for
      // demo: "childTwo"
    };
  }
};
</script>

````

此时，两个子组件均会收到父组件传递的数据：

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190407173313888.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2x2b252ZQ==,size_16,color_FFFFFF,t_70)

### 7、*p**a**r**e**nt*/children

### 8、ref-$refs

````javascript
<div id="app">
    <hdnews ref="hdnews"></hdnews>
    <hdinfo ref="hdinfo"></hdinfo>
</div>
````

````javascript
new Vue({
    el:'#app',
    mounted:function () {
        console.log(this.$refs.hdnews.news);
        console.log(this.$refs.hdinfo.news);
    }
})
````



### 9、slot-scope

- 还有一个，这个网上没有，我自己认为的，我觉得挺对的，slot-scope，本身父组件使用slot插槽是无法获取子组件的数据的，但是使用了slot-scope就可以获取到子组件的数据（拥有了子组件的作用域）



参考：

[vue的provide和inject特性](https://blog.csdn.net/lvonve/article/details/89072330)

[eventBus在vue中的使用](https://blog.csdn.net/qq_26834399/article/details/106387585)

