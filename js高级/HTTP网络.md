## 一.服务端的渲染和前后端的分离

### 1.1服务器端渲染（SSR）

☞服务器直接生成完整的HTML页面，并返回客户端，客户端只需要解析HTML的内容，无需通过JS动态渲染页面 

流程

- 客户端发送请求到服务器
- 服务器根据数据生成完整的HTML页面
- 服务器将HTML返回给客户端
- 客户端加载并显示，随后执行JS代码（绑定事件，激活交互之类的）

- 优点
  - SEO友好
  - 首屏加载块
  - 兼容性好
- 缺点
  - 服务器压力大
  - 开发成本高
  - 更新成本高
- 核心原理：服务器通过框架渲染API生成HTML，客户端加载后，将静态的HTML转换成可交互的动态页面

### 1.2前后端分离

一种架构模式，将前端和后端成为独立的系统。通过API接口通信，前端专注UI/交互，后端专注数据的处理，两者独立开发，部署和扩展

- 职责分离
- 通信方式：通过HTTP/HTTPS协交互，前端发送请求数据渲染页面
- 独立部署：前端打包成静态文件，部署到CDN或静态服务器，后端作为服务，部署到云服务器
- 优点
  - 开发效率高
  - 技术栈灵活
  - 扩展性强
- 缺点
  - 首次加载慢
  - SEO难度大
  - 跨域复杂

## 二.HTTP协议

### 2.1HTTP协议的介绍

传输超文本协议，互联网通信的基础

客户端（浏览器）向服务器发送请求，服务器返回响应数据。HTTP是无状态的，每次请求都是独立的，不会保留之前的信息

### 2.2HTTP的组成

由响应和请求两部分组成

- 请求request
  - 请求行
    包含请求方法，请求URL，HTTP的版本
  - 请求头
    包含请求的元数据 例如：Content-type User-Agent等
  - 请求体
    可选，携带请求的数据，如POST请求的数据
- 响应responce
  - 响应行
    包含HTTP版本，状态码和状态描述
  - 响应头
    包含响应的元数据，例如：Content-type Set-cookie等
  - 响应体
    服务器返回的数据，如HTML页面。JSON的数据等

### 2.3协议版本

- HTTP/1.0 每次请求都需要建立新的TCP连接，效率低
- HTTP/1.1 支持持久的连接，分块运输，请求头压缩等
- HTTP/2 基于SPDY协议 性能提升
- HTTP/3 基于QOIC协议 进一步优化了传输的性能

### 2.4HTTP请求方式

- GET
  - 获取资源：参数放在URL后面

- POST
  - 提交数据 参数放在请求体当中

- DELETE
  - 删除资源，通常用于完整的替换资源

- PATCH
  - 部分更新资源


### 2.5 http request header

- content-type 指定请求体的格式

  - appliction/x-www-form-urlcoded 表单的数据格式
  - multipart/form-data 文件的上传格式
  - application/json JSON数据格式
  - text/plain 纯文本格式

- 这些格式通过

  ```js
  xhr.setRequestHeader("Content-type")//进行设置
  ```

  

### 2.6响应码 responce status code

表示响应的结果

- 1xx 表示请求已经接收，继续处理
- 2xx 成功状态码，表示请求已经成功接受，理解和处理
  - 200 ok 请求成功
  - 201 created 资源成功创建
  - 204 No Content 请求成功 但是响应中没有数据
- 3xx 表示需要进行进一步操作，完成请求
- 4xx 客户端错误状态码
  - 400 错误请求
  - 401 未授权
  - 403 禁止访问
  - 404 请求的资源不存在
  - 405 请求方法不允许

## 三.chorme插件的安装

## 四.XMLHttpRequest

### 4.1基本使用过程

新建，设置监听，配置请求，发送请求 基本的步骤

```js
		//新建 XMLHTTPRequest对象
        const xhr = new XMLHttpRequest()

        
        //监听状态的改变 宏任务 进行回调
        xhr.onreadystatechange = function(){
            console.log(xhr.response) //获取结果
            if(xhr.readyState !== XMLHttpRequest.DONE)return 
            //将字符串转换成jSON对象
            console.log(JSON.parse(xhr.response))
        }


        //配置请求 只是配置
        // method 请求的方式：get/post/delete/put/patch
        xhr.open("get","") //这里不是发送请求


        //发送请求(浏览器帮助发送请求)
        xhr.send()
```



### 4.2监听onreadstatechange

- 不同的状态
  - 0 unset 初始状态 对象已经调用，但是没有使用open方法进行配置
  - 1 opened open方法已经调用，请求初始化但尚未发送
  - 2 headers-received 服务器已经响应并返回了响应头
  - 3 loading 响应体正在接受中
  - 4 done 整个请求已经完成

- 发送同步请求
  - 请求默认是异步的
  - 但是可以通过使用open将第三个参数设置成false发送同步请求

- 注意：
  - 同步请求会阻塞浏览器，导致页面卡顿
  - 现代浏览器不推荐使用同步请求
  - 同步请求在worker线程中仍然可用

- 其他的监听方法
  - onload  请求成功的时候触发
  - onerror 请求发生错误的是时候触发
  - onbort 请求被取消的时候触发
  - ontimeout 请求超时触发
  - onpeogress 监听上传/下载的进度
  - onloadstart/onloadend 请求开始结束的时候触发


### 4.3响应的类型和数据

- responceType = ”json“ 对象的一个属性，可以指定响应的数据的类型，设置成json类型，浏览器会自动设将浏览器返回的JSON字符串解析成JS对象，设定的返回值
- responce 对象的属性，用于获取响应的主体数据，格式取决于responseType的设置 数据的类型
- 根据业务选择合适的响应类型

### 4.4获取响应码

就是浏览器返回的响应码

- responce.status
  - 数值
  - 返回的是HTTP状态码，表示请求的结果

- responce.statusText 
  - 字符串类型
  - 返回HTTP文本的描述

- 注意：
  - 状态码和readyState的关系 只有当readyState === 4的是时候上面的状态才有效
  - 跨域请求的限制
  - 同步请求的特殊情况


### 4.5服务器传递参数的四种方法

- get query

  ```js
  const formEl = document.querySelector(".info")
  const sendBtn = document.querySelector(".send")
  const xhr = new XMLHttpRequest()
  xhr.onload = function(){
  	console.log(xhr.response)
  }
  xhr.responseType = "json"
  //直接在后面添加进行请求
  xhr.open("get","http://123.207.32.32:1888/02_param/getname=why&age=18&address=chengdu")
  xhr.send()
  
  ```

  
- post urlencoded

  ```js
  //给服务器传递方式
  xhr.open("post","http://123.207.32.32:1888/02_param/posturl")
  xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded")//设置类型
  xhr.send("name=huuyii&age=18&address=chengdu")
  ```

  
- formData

  ```js
  const formEl = document.querySelector(".info")
  const sendBtn = document.querySelector(".send")
  sendBtn,onclick = function(){
  	const xhr = new XMLHttpRequest()
  	xhr.onload = function(){
  		console,log(xhr.response)
  	}
  	xhr.responseType = "json"
  	xhr.open("post","http://123.207.32.32:1888/02_param/postform")
  	const formData = new FormData(formEl) //传入表单生成表单
  	//不是表单的数据需要自己手动进行键值对的设置
  	xhr.send(formData)
  }
  ```

  
- JSON

  ```js
  const formEl = document.querySelector(".info")
  const sendBtn = document.querySelector(".send")
  sendBtn,onclick = function(){
  	const xhr = new XMLHttpRequest()
  	xhr.onload = function(){
  		console,log(xhr.response)
  	}
  	xhr.responseType = "json"
  	xhr.open("post","http://123.207.32.32:1888/02_param/postjson")
      xhr.setRequestHeader("Content-type","application/json") //需要告诉浏览器发送的是什么类型的数据
      xhr.send(JSON.stringify({name:"huuyii",age:12,height:1.88})) 
      //记得要字符串化
  }
  ```

  

### 4.6ajax的基本封装

- 基本封装

  ```js
  function hyajax({
      url,
      method = "get",
      data = {},
      timeout = 10000,
      header = {}, //传入token
      success,
      failure
  } = {}) {
      //1。创建对象
      const xhr = new XMLHttpRequest()
      //2。设置监听
      xhr.onload = function () {
          // console.log(xhr.response)
          if (xhr.status >= 200 && xhr.status < 300) {
              success && success(xhr.response)
          } else {
              failure && failure({ status: xhr.status, message: xhr.statusText })
          }
      }
      //3.设置类型
      xhr.timeout = timeout
      xhr.responseType = "json"
      //4.open 
      if (method.toLocaleUpperCase() === "GET") {
          const queryString = [] //get请求 收到参数
          for (const key in data) {
              queryString.push(`${key}=${data[key]}`) //转换成数组
          }
          url = url + "?" + queryString.join("&")
          // console.log(url)
          xhr.open(method, url)
          xhr.send()
      } else {
          //send /发送的post请求 采用JSON的格式
          xhr.open(method, url)
          xhr.setRequestHeader("Content-type", "application/json")
          xhr.send(JSON.stringify(data))
      }
      return xhr //返回可以手动取消 但是Promise不能进行返回
  }
  ```

  

- 各个参数

- 返回Promise回调，避免回调地狱

  ```js
  function hyajax({
      url,
      method = "get",
      data = {},
      header = {}, //传入token
  } = {}) {
      //创建对象
      const xhr = new XMLHttpRequest()
      const promise =  new Promise((resolve, reject) => {
          //1。创建对象
          // const xhr = new XMLHttpRequest()
          //2。设置监听
          xhr.onload = function () {
              // console.log(xhr.response)
              if (xhr.status >= 200 && xhr.status < 300) {
                  resolve(xhr.response)
              } else {
                  reject(err)
              }
          }
          //3.设置类型
          xhr.responseType = "json" 
          //4.open 
          if (method.toLocaleUpperCase() === "GET") {
              const queryString = [] //get请求 收到参数
              for (const key in data) { //将对象类型转换成数组形式！！
                  queryString.push(`${key}=${data[key]}`) //转换成数组
              }
              url = url + "?" + queryString.join("&")
              // console.log(url)
              xhr.open(method, url)
              xhr.send()
          } else {
              //send /发送的post请求 采用JSON的格式
              xhr.open(method, url)
              xhr.setRequestHeader("Content-type", "application/json")
              xhr.send(JSON.stringify(data))
          }
      })
      promise.xhr = xhr //这里想要传出去就使用对象进行操作 携带着传出去
      return promise
  
  }
  ```

  

### 4.7 timeout和abort

- timeout设置超时事件

- abort设置取消事件

- ```js
          const xhr = new XMLHttpRequest()
  
          xhr.onload = function(){
              console.log(xhr.response)
          }
          xhr.ontimeout = function(){
              console.log("访问已经取消")
          }
          xhr.onabort = function(){
              console.log("请求已经取消")
          }
          xhr.responseType = "json"   //能够将返回值设置成对象类型      
          //浏览器达到过期时间，没有拿到，就直接取消请求
  
          //过期时间的设置 ，默认没有过期时间 超时时间
          // xhr.timeout = 3000
          xhr.open("get","http://123.207.32.32:1888/01_basic/timeout")
  
          xhr.send()
  
          //手动取消请求
          const cancelBtn = document.querySelector("button")
          cancelBtn.onclick = function(){
              xhr.abort()//取消请求
          }
  ```

  

## 五Fetch

### 5.1fetch的基本使用

fetch发送get请求 返回的就是promise

```js
        fetch("http://123.207.32.32:8000/home/multidata").then(res => {

            //获取对应的responce
            const response = res

            //获取具体的结果
            response.json().then(res => {
                console.log(res)
            })
            // console.log(res)
        }).catch(err => {
            console.log(err)
        })
```



### 5.2Fetch的代码优化

- promise的then中的return

  ```js
          fetch("http://123.207.32.32:8000/home/multidata").then(res => {
  
              //获取对应的responce
              const response = res
  
              //获取具体的结果
             return response.json() //返回的也是promise
              // console.log(res)
          }).then(res => {
              console.log(res)
          }).catch(err => {
              console.log(err)
          })
  //then也是promise返回值，直接return
  ```

  
- await/async的写法

  ```js
          async function getDate() { //返回的是peomise就可以使用
              const response = await fetch("http://123.207.32.32:8000/home/multidata") 
              const res = await response.json()
              console.log(res)
          } 
          getDate()
  ```

  前面拿到结果最后拿到相对应的数据

  Promise使用await async进行优化

### 5.3Fetch的请求参数

- JSON形式上传

  ```js
          async function getDate() { //返回的是peomise就可以使用
              // JSON形式
              const response = await fetch("http://123.207.32.32:1888/02_param/postjson",{
                  method : "post",
                  headers : {
                      "Content-type" : "application/json" //记得转成JSON类型
                  }, 
                  //需要转化成JSON类型才能转递
                  body : JSON.stringify({
                      name : "huuyii",
                      age : 10
                  })
              })
              const res = await response.json()
              console.log(res)
             }
  ```

- foem表单请求

  ```js
          async function getDate() { //返回的是peomise就可以使用)
              //这个是传递form形式
              const formData = new FormData()
              formData.append("name","huuyii") //原来不是表单，需要手动设置键值对
              formData.append("age",19)
              const response = await fetch("http://123.207.32.32:1888/02_param/postform",{
                  method : "post",
                  //需要转化成JSON类型才能转递
                  body : formData
              })
  
              //获取responce的状态
              console.log(response.statusText,response.status,response.ok)
              //ok的状态码 就是200 - 299
              const res = await response.json()
              console.log(res)
          }
  ```

  

## 六文件上传

### 6.1XMLHttpRequest的文件上传

```js
        const BtnEl = document.querySelector(".upload")
        BtnEl.onclick = function(){
            console.log("文件上传")
            
            const xhr = new XMLHttpRequest()
            xhr.onload = function(){
                console.log(xhr.response)
            }

            //xhr上传能够查看上传的进度
            xhr.onprogress = function(event){
                console.log(event)
            }

            xhr.responseType = "json"
            xhr.open("post","http://123.207.32.32:1888/02_param/upload")
            //表单
            const fileEl = document.querySelector(".file")
            // console.log(fileEl.files)
            const file = fileEl.files[0]
            const formData = new FormData()
            formData.append("avatar",file) //放在表单里面
            //创建表单，是键值对的形式 手动设置键值对
            //现有的表单元素就不需要手动进行，直接传入new的地方就行
            xhr.send(formData)
        }
```



### 6.2Fetch的文件上传

```js
        const BtnEl = document.querySelector(".upload")
        BtnEl.onclick = async function(){
            

            const fileEl = document.querySelector(".file")
            // console.log(fileEl.files)
            const file = fileEl.files[0]
            const formData = new FormData()
            formData.append("avatar",file) //放在表单里面
            //创建表单，是键值对的形式 手动设置键值对
            //现有的表单元素就不需要手动进行，直接传入new的地方就行

            //发送fetch请求 fetch不能监控文件上传的进度
            const responce = await fetch("http://123.207.32.32:1888/02_param/upload",{
                method : "post",
                body : formData
            })
            
            const res = await responce.json()
            console.log(res)
        }
```



## 思考

1说说对服务端渲染和前后端分离的理解
![image-20250516191951623](C:\Users\Lenovo\AppData\Roaming\Typora\typora-user-images\image-20250516191951623.png)

2说说对HTTP协议的理解

- 无状态
  - 每次请求都是对立的，不保留之前的信息
  - 简化服务器设计 提升性能
  - 需要通过cookie Session进行维护
- 无连接
  - 1.0每次连接之后的都会断开
  - 1.1引入持久连接 复用TCP连接
- 简单灵活
- 可靠传输

协议组成

- 请求行
- 请求头
- 。。。请求的格式
- 响应的格式

3封装XMLHttpRequest的网络请求

4说说XMLHttpRequest和Fetch请求的异同

相同点：

- 都用于浏览器中发送HTTP请求，于服务器进行异步通信
- 支持常见的HTTP方法 ，可设置请求头和携带请求体 可处理JSON XML等多种响应格式

**不同点**

| **特性**            | **XMLHttpRequest (XHR)**                      | **Fetch API**                                        |
| ------------------- | --------------------------------------------- | ---------------------------------------------------- |
| **API 设计**        | 事件驱动（回调地狱问题）                      | 基于 Promise（支持 `async/await`）                   |
| **请求方式**        | 需手动配置较多细节（如 `onreadystatechange`） | 更简洁，链式调用（如 `fetch().then().catch()`）      |
| **响应处理**        | 需检查 `readyState` 和 `status`               | 直接返回 Promise，需手动解析响应体（如 `.json()`）   |
| **默认行为**        | 自动发送 cookies（同源策略）                  | 默认不发送 cookies，需显式设置 `credentials`         |
| **错误处理**        | 需手动处理网络错误和 HTTP 状态码（如 404）    | 仅网络错误触发 `reject`，状态码非 2xx 仍为 `resolve` |
| **请求取消**        | 调用 `abort()` 方法                           | 使用 `AbortController`                               |
| **上传 / 下载进度** | 支持 `onprogress` 事件                        | 需通过 `ReadableStream` 手动实现                     |
| **兼容性**          | 支持 IE10+（需 polyfill）                     | 现代浏览器（IE 不支持）                              |
