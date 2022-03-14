## 常用的：

主要实例之一主要用于修饰，可以使用它们为元素添加一些视觉效果，如下：

````html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <title>CSS 伪元素</title>
        <meta charset="utf-8" />
        <style>
            h1 {
                font-weight: bold;
                text-align: center;
            }

            h1::after {
                content: "";
                display: block;
                background-color: #19b5fe;
                height: 0.2em;
                width: 100%;
            }

            h1::before {
                content: "";
                display: block;
                background-color: #19b5fe;
                height: 0.2em;
                width: 100%;
            }
        </style>
    </head>
    <body>
        <h1>DevPoint</h1>
    </body>
</html>

````

效果如下：

![23.jpg](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8238e9344d094bbead86862a52b9a0a3~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)