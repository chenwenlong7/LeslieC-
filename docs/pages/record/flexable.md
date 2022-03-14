## 背景

> 移动端适配是在开发中经常碰见的场景了，借着今天这个时间点把这个知识点总结一下，加深印象。

## 一、是什么

首先有个现象需要知道。在PC浏览器中，当内容的宽大于`viewport`的宽时，我们可以看到横向的滚动条；而在手机浏览器中表现是不同的，此时当内容的宽大于`viewport`的宽时，我们的手机屏幕依然能够显示这些内容（没有滚动条）。更加具体地说，我们知道IphoneX的像素宽为`375px`，无论我们的`html`有没有加`meta`头部，只要`html`内容宽度小于某个较大的数值，整个手机屏幕都可以放下内容（没有滚动条）；只有当`html`内容宽度大于那个数值，我们才能够看到滚动条。这个现象可以自行验证。

如果我们写了一个不带`meta`头部的`html`页面，并在手机浏览器打开，可能会觉得页面呈现出的效果完全不符合预期，甚至可以说得上诡异。

我们现在开发手机页面基本上必须带上`meta`头部，那为什么不带这个头部时，浏览器表现的这么奇怪呢？

````html
<meta name="viewport" content="width=device-width,initial-scale=1">
````

这是有历史原因的，我们知道，智能手机的诞生要远远晚于PC浏览器。而智能手机诞生后，为了能更方便的浏览当时的页面（当时页面普遍宽980px左右），手机浏览器的默认`viewport`也被设置成了980px。`viewport`980px意味着在小小的手机屏幕上放置了过量的内容，所以那个时候我们需要使用双指缩放整个页面，然后滑动手指来阅读页面。

因此，现代的移动端页面都应该带上`meta`，根据当前的移动设备来设置`viewport`，比如手机是IphoneX的话，`viewport`就会被设置为375px。

想要开发一个现代化的、用户体验良好的网站，最重要的就是满足以下设备浏览器的适配：①PC，②Ipad，③手机。

我们可以通过PC浏览器访问知名的站点，比如B站、知乎、Github、V2ex等，再不断调整浏览器`viewport`，从而观察这些网站是如何适配不同的设备的。

##### PC -> Ipad

通过观察上述的几个站点首页，能够发现他们存在一个相似点：页面都存在**留白区域**，并且基本上页面主体内容在中间，左右留白。而这些留白区域主要是依靠`margin: 0 auto`或`flex`等方法来实现的。

当我们通过调整浏览器的可视区域来缩小`viewport`，比如从最初的`1920px`缩短至`1030px`左右（后者的值接近Ipad的`viewport`，数值上下略有浮动），这些留白部分也随之变少，直到消失。

而我们的主体内容几乎没有变化，从而实现了**PC端向Ipad端的适配**。

> 像知乎，腾讯课堂。当viewport缩放到1030px左右，主体内容已经被遮挡住一些了，所以无法直接适配Ipad。当我们用Ipad访问这两个网站时，可以很清楚的发现**页面重置**了一下，大概是开发者修改了Ipad的viewport从而容纳更多的内容

##### [#](https://messiahhh.github.io/blog/frontend/css.html#ipad-phone)Ipad -> Phone

当我们继续调整浏览器的可视区域，从`1030px`左右缩短至`400px`左右（大部分手机的`viewport`在这个值附近浮动），**理论上可以直接实现Ipad端向移动端的适配**。

但这有个前提是我们手机`400px`的`viewport`可以容纳原本`1030px`乃至`1920px`才放得下的内容，`1920px`可以通过减少留白区域这种取巧的方式来实现向`1030px`的适配，但`1030px`已经填满了内容，很难再继续直接适配`400px`了。

我们用Ipad打开B站，它的首页可以容纳三十张左右的图片，但我们不可能在手机上放下这么多的内容——那用户体验也太差了。

因此B站实际上分别为了PC和移动端维护了一份代码。当我们访问`bilibili.com`时，服务器根据我们的请求头来识别这个请求是来自PC浏览器还是手机浏览器。如果是手机浏览器，它就会使我们跳转到`m.bilibili.com`，从而给我们移动端的页面。

> 当我们将`viewport`从`1030px`左右逐渐缩短，页面会出现横向的滚动条，这是因为B站的PC页面设置了`min-width`。

B站无法直接实现Ipad向移动端的适配，主要原因是页面的内容太多，特别是有许多图片。

除了额外写一套代码来适配移动端，对于没有太多内容的网站来说，可以借助媒体查询和响应式来实现**Ipad端向移动端的适配**。具体的例子有Github，Vuepress、Firefox等，更多其他的媒体查询例子可以在[该网站](https://mediaqueri.es/)找到。

## 二、实现方式

响应式设计的基本原理是通过媒体查询检测不同的设备屏幕尺寸做处理，为了处理移动端，页面头部必须有`meta`声明`viewport`

```html
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no”>
```

属性对应如下：

- width=device-width: 是自适应手机屏幕的尺寸宽度
- maximum-scale:是缩放比例的最大值
- inital-scale:是缩放的初始化
- user-scalable:是用户的可以缩放的操作

实现响应式布局的方式有如下：

- 媒体查询
- 百分比
- vw/vh
- rem

### [媒体查询](https://vue3js.cn/interview/css/responsive_layout.html#媒体查询)

`CSS3`中的增加了更多的媒体查询，就像`if`条件表达式一样，我们可以设置不同类型的媒体条件，并根据对应的条件，给相应符合条件的媒体调用相对应的样式表

使用`@Media`查询，可以针对不同的媒体类型定义不同的样式，如：

```css
@media screen and (max-width: 1920px) { ... }
```

当视口在375px - 600px之间，设置特定字体大小18px

```css
@media screen (min-width: 375px) and (max-width: 600px) {
  body {
    font-size: 18px;
  }
}
```

通过媒体查询，可以通过给不同分辨率的设备编写不同的样式来实现响应式的布局，比如我们为不同分辨率的屏幕，设置不同的背景图片

比如给小屏幕手机设置@2x图，为大屏幕手机设置@3x图，通过媒体查询就能很方便的实现

### [百分比](https://vue3js.cn/interview/css/responsive_layout.html#百分比)

通过百分比单位 " % " 来实现响应式的效果

比如当浏览器的宽度或者高度发生变化时，通过百分比单位，可以使得浏览器中的组件的宽和高随着浏览器的变化而变化，从而实现响应式的效果

`height`、`width`属性的百分比依托于父标签的宽高，但是其他盒子属性则不完全依赖父元素：

- 子元素的top/left和bottom/right如果设置百分比，则相对于直接非static定位(默认定位)的父元素的高度/宽度
- 子元素的padding如果设置百分比，不论是垂直方向或者是水平方向，都相对于直接父亲元素的width，而与父元素的height无关。
- 子元素的margin如果设置成百分比，不论是垂直方向还是水平方向，都相对于直接父元素的width
- border-radius不一样，如果设置border-radius为百分比，则是相对于自身的宽度

可以看到每个属性都使用百分比，会照成布局的复杂度，所以不建议使用百分比来实现响应式

### [vw/vh](https://vue3js.cn/interview/css/responsive_layout.html#vw-vh)

`vw`表示相对于视图窗口的宽度，`vh`表示相对于视图窗口高度。 任意层级元素，在使用`vw`单位的情况下，`1vw`都等于视图宽度的百分之一

### [rem](https://vue3js.cn/interview/css/responsive_layout.html#rem)

在以前也讲到，`rem`是相对于根元素`html`的`font-size`属性，默认情况下浏览器字体大小为`16px`，此时`1rem = 16px`

可以利用前面提到的媒体查询，针对不同设备分辨率改变`font-size`的值，如下：

```css
@media screen and (max-width: 414px) {
  html {
    font-size: 18px
  }
}

@media screen and (max-width: 375px) {
  html {
    font-size: 16px
  }
}

@media screen and (max-width: 320px) {
  html {
    font-size: 12px
  }
}
```

为了更准确监听设备可视窗口变化，我们可以在`css`之前插入`script`标签，内容如下：

```javascript
//动态为根元素设置字体大小
function init () {
    // 获取屏幕宽度
    var width = document.documentElement.clientWidth
    // 设置根元素字体大小。此时为宽的10等分
    document.documentElement.style.fontSize = width / 10 + 'px'
}

//首次加载应用，设置一次
init()
// 监听手机旋转的事件的时机，重新设置
window.addEventListener('orientationchange', init)
// 监听手机窗口变化，重新设置
window.addEventListener('resize', init)
```

**这也是淘宝此前移动端适配的原理**

只要 `html` 的 `font-size` 的大小变了，`width` 就会自动变，所以 `rem` 是通过动态设置 `html` 的 `font-size` 来改变 `width` 的大小，以达到网页自适应大小的目的

> rem(倍数） =  width  / （html的font-size）=>  width = (html的font-size) * rem(倍数)

无论设备可视窗口如何变化，始终设置`rem`为`width`的1/10，实现了百分比布局

除此之外，我们还可以利用主流`UI`框架，如：`element ui`、`antd`提供的栅格布局实现响应式

## 三、总结

常见的移动端适配可以用到`flexable +postcss-px2rem 大屏`的技术，也可以相对于窗口使用vw/vh。不过现在因为tailwind的出现已经可以实现pc/移动端一把梭了，适合自己的就是最好的。



**参考：**

[PC与移动端](https://messiahhh.github.io/blog/frontend/css.html#pc%E4%B8%8E%E7%A7%BB%E5%8A%A8%E7%AB%AF)