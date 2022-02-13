---
title: HLS的学习
date: 2021-05-30 18:00:55
tags: 
      - 学习
categories: 需求学习
---

> 因为微信版本的迭代使得很多m3u8格式的视频都不兼容微信新版本的内核了，为此需要引入`hls.js`。在播放卡顿的时候能自动切换为`HLS`进行点播，使得体验更顺畅。



# HLS的定义

> HTTP Live Streaming（缩写是HLS）是一个由苹果公司提出的基于HTTP的流媒体网络传输协议。是苹果公司QuickTime X和iPhone软件系统的一部分。它的工作原理是把整个流分成一个个小的基于HTTP的文件来下载，每次只下载一些。当媒体流正在播放时，客户端可以选择从许多不同的备用源中以不同的速率下载同样的资源，允许流媒体会话适应不同的数据速率。在开始一个流媒体会话时，客户端会下载一个包含元数据的extended M3U (m3u8)playlist文件，用于寻找可用的媒体流。
> HLS只请求基本的HTTP报文，与实时传输协议（RTP)不同，HLS可以穿过任何允许HTTP数据通过的防火墙或者代理服务器。它也很容易使用内容分发网络来传输媒体流。
> 苹果公司把HLS协议作为一个互联网草案（逐步提交），在第一阶段中已作为一个非正式的标准提交到IETF。但是，即使苹果偶尔地提交一些小的更新，IETF却没有关于制定此标准的有关进一步的动作。



## 协议简介

**HLS协议规定：**

+ 视频的封装格式是TS。
+ 视频的编码格式为H264,音频编码格式为MP3、AAC或者AC-3。
+ 除了TS视频文件本身，还定义了用来控制播放的m3u8文件（文本文件）。

为什么苹果要提出HLS这个协议，其实他的主要是为了解决RTMP协议存在的一些问题。比如RTMP协议不使用标准的HTTP接口传输数据，所以在一些特殊的网络环境下可能被防火墙屏蔽掉。但是HLS由于使用的HTTP协议传输数据，不会遇到被防火墙屏蔽的情况（该不会有防火墙连80接口都不放过吧）。

另外于负载，RTMP是一种有状态协议，很难对视频服务器进行平滑扩展，因为需要为每一个播放视频流的客户端维护状态。而HLS基于无状态协议（HTTP），客户端只是按照顺序使用下载存储在服务器的普通TS文件，做负责均衡如同普通的HTTP文件服务器的负载均衡一样简单。

另外HLS协议本身实现了码率自适应，不同带宽的设备可以自动切换到最适合自己码率的视频播放。其实HLS最大的优势就是他的亲爹是苹果。苹果在自家的IOS设备上只提供对HLS的原生支持，并且放弃了flash。Android也迫于平果的“淫威”原生支持了HLS。这样一来flv，rtmp这些Adobe的视频方案要想在移动设备上播放需要额外下点功夫。当然flash对移动设备造成很大的性能压力确实也是自身的问题。

与基于UDP的RTP协议不同，HLS请求仅使用HTTP传输，因此可以穿过任何允许HTTP数据通过的防火墙或代理服务器。这也便于使用传统的HTTP服务器作为源，并广泛使用基于HTTP的内容分发网络来传输媒体流。

虽然HLS有上述优势，但也同时存在延迟过大的劣势。**采用HLS直播的视频流延时一般在10秒以上，使用推荐配置时延迟大概在30s，而RTMP直播的延迟最低可达到3、4秒，因此，在对实时性要求较高的场合，如互动直播，就要慎用HLS了。**

![img](https://developer.apple.com/library/archive/documentation/NetworkingInternet/Conceptual/StreamingMediaGuide/art/transport_stream_2x.png)



来解释一下这张图，从左到右讲，左下方的inputs的视频源是什么格式都无所谓，他与server之间的通信协议也可以任意（比如RTMP），总之只要把视频数据传输到服务器上即可。这个视频在server服务器上被转换成HLS格式的视频（既TS和m3u8文件）文件。细拆分来看server里面的Media encoder的是一个转码模块负责将视频源中的视频数据转码到目标编码格式（H264）的视频数据，视频源的编码格式可以是任何的视频编码格式（参考《视频技术基础》）。转码成H264视频数据之后，在stream segmenter模块将视频切片，切片的结果就是index file（m3u8）和ts文件了。图中的Distribution其实只是一个普通的HTTP文件服务器，然后客户端只需要访问一级index文件的路径就会自动播放HLS视频流了。



## HLS的index文件

`所谓index文件就是之前说的m3u8文本文件。`

![img](https://developer.apple.com/library/archive/documentation/NetworkingInternet/Conceptual/StreamingMediaGuide/art/indexing_2x.png)

如上图所示，客户端播放HLS视频流的逻辑其实非常简单，先下载一级Index file，它里面记录了二级索引文件（Alternate-A、Alternate-B、Alternate-C）的地址，然后客户端再去下载二级索引文件，二级索引文件中又记录了TS文件的下载地址，这样客户端就可以按顺序下载TS视频文件并连续播放。

## 什么是m3u8(hls)格式视频

这两年来我们发现越来越多的视频应用使用了m3u8格式的视频，因为可以兼容PC、移动端。相比mp4等视频源，m3u8可以减轻服务器压力（按需加载）。HLS是由苹果公司率先提出的一种协议标准，可用于直播。

> m3u8是一种基于HLS(HTTP Live Streaming) 文件视频格式，它主要是存放整个视频的基本信息和分片(Segment)组成。不同于mp4大文件，m3u8是由一系列的ts文件组成，一般一个ts文件大概5-10秒，这些ts文件通过一个.m3u8文件做索引。用户播放视频时，可随意拖动视频进度，会读取相应进度的ts文件继续观看视频，不必等到下载完整的视频。因此在播放m3u8的时候很少有卡顿的现象。
>
> 关于HLS直播的技术示例以及m3u8切片技术我们会在后面有文章介绍。本文只做HLS点播讲解，与直播不同，点播是指视频文件已经在编辑好，随时可播放。
>
> 由于HLS是由Apple公司提出的，所以在iOS电脑或手机上，你可以直接使用Safari浏览器的`<video>`播放m3u8格式视频文件。而其他浏览器则需要借助hls.js来兼容m3u8。
>
> 使用hls.js，不需要任何定制的播放器，只需要`<video>`元素就能播放m3u8。



## 播放模式

+ **点播VOD**的特点就是当前时间点可以获取到所有index文件和ts文件，二级index文件中记录了所有ts文件的地址。这种模式允许客户端访问全部内容。上面的例子中就是一个点播模式下的m3u8的结构。

+ **Live**模式就是实时生成M3u8和ts文件。它的索引文件一直处于动态变化的，播放的时候需要不断下载二级index文件，以获得最新生成的ts文件播放视频。如果一个二级index文件的末尾没有#EXT-X-ENDLIST标志，说明它是一个Live视频流。

  

  客户端在播放VOD模式的视频时其实只需要下载一次一级index文件和二级index文件就可以得到所有ts文件的下载地址，除非客户端进行比特率切换，否则无需再下载任何index文件，只需顺序下载ts文件并播放就可以了。但是Live模式下略有不同，因为播放的同时，新ts文件也在被生成中，所以客户端实际上是下载一次二级index文件，然后下载ts文件，再下载二级index文件（这个时候这个二级index文件已经被重写，记录了新生成的ts文件的下载地址）,再下载新ts文件，如此反复进行播放。

  

**说了这么多直接开干**

***

### 加载js和播放元素

在需要放置视频的页面位置上加入video元素和hls.js文件。

````javascript
<video id="video" controls width="100%"></video>
<script src="hls.js"></script>
````

### 调用hls.js

首先判断浏览器是否支持hls，如果支持就实例化`new Hls()`，加载m3u8源，然后播放。如果不支持hls，而支持苹果原生应用，则播放另一个m3u8源。

````javascript
var video = document.getElementById('video');
  if(Hls.isSupported()) {
    var hls = new Hls();
    hls.loadSource('https://yunqivedio.alicdn.com/2017yq/v2/0x0/96d79d3f5400514a6883869399708e11/96d79d3f5400514a6883869399708e11.m3u8');
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED,function() {
      video.play();
  });
 } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = 'https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8';
    video.addEventListener('loadedmetadata',function() {
      video.play();
    });
  }
````

**运行，试着用PC浏览器和手机访问，你会发现m3u8的播放很流畅。**



### 在Vue中使用hls.js

使用Vue框架的同学可以用npm先安装hls。

````js
npm install --save hls.js
````

然后添加组件。

````javascript
<video ref="videoRef" width="400" controls></video>
````

最后挂载代码：

````javascript
<script>
import Hls from 'hls.js'; 

export default {
    data () {
        return {
            //
        }
    },
    mounted: function() {
      var hls = new Hls();
      hls.loadSource('https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8');
      hls.attachMedia(this.$refs.videoRef);
      hls.on(Hls.Events.MANIFEST_PARSED,function() {
        this.$refs.videoRef.play();
      });
    }
}
</script>
````

**其他**

基于hls.js开发了很多用于html5播放器的插件，让这些播放器也支持m3u8格式播放。





## 总结

其他的一些暂时没想到，暂时就这么多了，想到了再补充。如果想了解更多可以先多看看文档和查查资料，不过干就完事了。



参考：

[HLS协议介绍](https://www.jianshu.com/p/426425cad08a)

[HTML5点播m3u8(hls)格式视频](https://cloud.tencent.com/developer/article/1626973?from=information.detail.hls.js%20%E7%94%A8%E6%B3%95)

