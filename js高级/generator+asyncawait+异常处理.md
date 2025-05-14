## 一.generator异步处理

```js
function requestDate(url){
	return new Promise((resolve,reject) => {
		setTimeout(() => { //模拟异步操作
			resolve(url)
		},1000)
	})
}

//发送网络请求
requestDate("https://baidu.com").then(res => {
	console.log("res:",res)
}).catch(() => {
	
})
```

要求：

1.发送网络请求，等到这次的网络请求的结果

2.发送第二次网络请求，等待结果

3.发送第三次网络请求

### 1.1处理一.回调地狱（层层嵌套）

```js
        function getDate(){

            //第一次请求
            requestDate("huuyii").then(res1 => {
                console.log("第一次的结果：",res1)

                //第二次请求
                requestDate(res + "aaa").then(res2 => {
                    console.log("第二次的结果",res2)


                    //第三次请求
                    requestDate(res2+"bbb").then(res3 => {
                        console.log("第三次请求的结果",res3)
                    })
                })
            })
        }
```



### 1.2处理二.Promise链式

```js
        function getDate(){
            requestDate("huuyii").then(res1 => {
                console.log("第一次结果：",res1)
                return requestDate(res1 + "aaa")
                //这里可以进行返回普通值 或者return Promise 能够返回给下面的then新的新的Promise的结果
            }).then(res2 => {
                console.log("第二次结果：",res2)
                return requestDate(res2 + "bbb")
            }).then(res3 => {
                console.log("第三次结果",res3)

            })
        }
//使用Promise的返回值进行操作
```



### 1.3处理三.generator+yield

使用yield进行操作 yield能够暂停函数的执行直到Promise有结果才继续运行

使用next能够将暂停的函数继续向下执行，直到return

注意直接return也能停止执行函数，直接跳出函数

```js
//更加简单的处理方式
funtion* getDate(){//生成器函数本身返回的就是对象{done:false/true value:值/undefined}
	const res1 = yield requestDate("huuyii")
	console.log(res1)
	const res2 = yield requestDate(res1 + "aaa")
	console.log(res2)
	const res3 = yield requestDate(res2 + "bbb")
	console.log(res3)
}
const genterator = getDate()
generator.next().value.then(res1 => {// console.log("结果:",res1) //能够拿到结过 有结果才能接着走
generator.next(res1).value.then(res2 => {//将每一次的res结果传回去
generator.next(res2).value.then(res3 => {
generator.next(res3)
                })
            })
        })
```



### 1.4处理四.await/async操作

```js
async funtion getDate(){
	const res1 = await request("huuyii")//相当于进行访问拿到结果
	console.log(res1)
	const res2 = await request(res1 + "bbb")
	console.log(res2)
	const res3 = await request(res2 + "ccc")
	console.log(res3)
}
const generator = getDate()//直接这样就能直接调用进行生成
```



### 1.5自动执行generator函数（递归）

自己实现的函数能够在不知道有多少个值的时候进行递归找到每一个值

getDate就是从上面的函数

```js
function execGenFn(genFn){
	const generator = genFn() //获取递归的generator
	funtion exec(res){ //定义递归函数
		//这里返回的是迭代器 {done:false/true,value:undefined/值} 
		//生成器返回的对象具有done和value属性
		const result = generator.next()
		if(result.done)return 
		result.value.then(res => {
			exec(res)
		})
	}
	execc()
}
```

### 1.6注意：

- 理解Generator的原理
  - 是一种特殊的函数，通过yield控制函数的运行，经常与async和swait结合使用
- 记得有错误处理 
  - 确保在生成器中内部正确捕获异常处理和处理异常
- 资源管理 
  - 可以在最后加上finally进行管理
  - 不管是什么情况都可以执行的代码
- 性能优化

## 二.async/await

使用这个能够让我们更简单的使用异步函数 await的返回值直接就是Promise对象
更接近同步函数的写法 await后面的异步函数的返回值中直接可以传回到最前面的变量的身上，然后后面再次调用就行

### 2.1异步函数async

和普通函数的区别

- 返回的是Promise对象
- return实际上返回的是Promise.resolve(value)
- 能够使用await暂停函数的执行，直到Promise被解决，而普通函数就只能使用回调函数或者Promise进行链式调用
- 暂停时间，JS引擎能够继续执行代码，不会阻塞主线程

异步函数

```js
async funtion foo(){
	console.log("1")
	console.log("2")
	console.log("3")
}

foo()

//类里面也可以定义异步函数
class Person{
	async running(){
	
	}
}

//调用async的方法的时候调用await等待结果

```



### 2.2异步函数的返回值

- 普通值
  普通值直接就是通过resolve进行返回，成功的决议

- promise
  返回的是promise 使用新的promise作为返回值来判断对错

- thenable
  返回的是对象(既有then方法)，看使用的是什么方法来进行决议

- 异步函数的异常

  ```js
  async funtion foo(){
  	console.log("-------1")
  	console.log("-------2")
  
  	throw new Error("huuyii")//如果执行代码的中途抛出错误，就不会继续执行代码，就会将错误进行抛出直到有个地方处理这个错误，浏览器会作为最后一个对象，处理这个错误
  	console.log("------3")
  }
  
  foo().then(res => console.log(res)).catch(err => console.log(err))
  ```

  

### 2.3async中使用的await

- await只能在异步函数async中使用
- await表达式返回Promise
  使用await通常会跟着一个表达值，返回的是Promise
  等到Promise返回结果后函数里面的代码才会继续执行
- await后续的代码会等待有resolve结果，才继续执行
- async和await的结合

  - 当有多个异步函数的时候，在调用await的函数能够使用await调用每一个异步函数，等到调用有结果之后才会继续执行
    当代码执行的过程中，出现错误的时候会抛出错误，找到最近的catch报错
- await如果后面的promise没有返回值就暂停执行下面的代码
- 注意计时器的延时时间

## 三.事件循环/队列

### 3.1进程和线程

函数的执行过程中会创建自己的执行上下文，等待执行完之后就会弹出执行上下文栈
Js只有单线程
一次只会执行一次上下文
每次遇到新的函数调用，会创建新的上下文

进程与线程的联系与区别：

- 进程包含线程 就像是流水线上的每一个工人一样
- 共享进程资源
- 协同工作

### 3.2Js是单线程的

只有一个线程，但是如果有setTimeout等的函数，浏览器会创建新的线程来进行操作

### 3.3事件队列/循环

![image-20250513202539308](C:\Users\Lenovo\AppData\Roaming\Typora\typora-user-images\image-20250513202539308.png)

```js
    <button>按钮</button>
    <script>

        const btnEl = document.querySelector("button")
        btnEl.onclick = function(){
            console.log("btn onclick") //这里也是加到事件队列当中
        }
        console.log("Hello world!")
        let name = "huuyii"
        name = "kkk"
        console.log(name)

        //这里会有专门的一个工人（线程）来执行 浏览器操作


        //这里的加入事件队列是指等到时间结束才会加入
        setTimeout(() => {
            console.log("计时器操作5s")
        },5000)
        setTimeout(() => {
            //操作的时候六浏览器创建新的线程执行这个
            //这个函数会创建自己的执行上下文 创建后立马弹出
            //还会有一个队列结构 来操作这个一个一个执行 将这个操作加入时间队列当中
            console.log("计时器操作2s")
        }, 2000);//就算这个是0s也不会立即执行
        //时间到了就会加入到调用栈当中 不会阻塞后续代码的执行
        
        console.log("计时器后面的操作")
    </script>
```



### 3.4宏任务和微任务

script本身就是一个宏任务

![image-20250513202513049](C:\Users\Lenovo\AppData\Roaming\Typora\typora-user-images\image-20250513202513049.png)



- 调度过程
  - 在执行下一个宏任务之前会清空微任务队列
- 像setTimeout等的函数就会加入宏任务
- 但是Promise等的内容会加入到微任务当中
- 每次宏任务执行之前，微任务都会清空
- 注意 、
  - setTieout就算是0s也不会立即执行，会进入宏任务队列等待执行
  - 使用await暂停的地方，后面的也是会作为微任务的部分

### 3.5面试题：Promise/async/await

面试题一：判断代码的执行顺序不难注意过程就行

```js
       function requestDate(url) {
            console.log("requestDate") //注意这个Promise是同步执行的部分
           //直接就会执行 ，不用等待结果调用就会执行
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    console.log("setTimeout")
                    resolve(url)
                }, 2000);
            })
        }

        //1.使用Promise进行调用
        // function getDate(){
        //     console.log("getDate start")
        //     requestDate("huuyii").then(res => {//这个then会等到上面的settimeout执行完才会继续执行
        //         console.log("then1-res:",res)
        //     })
        //     console.log("getDate end")
        // }


        //2。async和await 转换成异步函数
        async function getDate() {
            console.log("getDate start")
            const res = await requestDate("huuyii") //拿到结果继续执行 没有结果的时候会暂停
            //但是函数外面的还是会继续执行

            //使用await 这个后面的可以当成微任务进行处理 当成then的内容进行处理
            console.log("then1-res", res)
            console.log("getDate end")
        }

        getDate() //异步函数的执行过程适合普通函数的执行过程是一样的
```

面试题二：

```js
        async function async1() {
            console.log("async1 start")
            await async2() //await后面的会直接执行  如果后面的是正常的函数就是正常的执行顺序
            //还有await前面的代码也会等结果出来后才会执行
            //但是后面的会加入微任务 因为 async是return 的promise的then
            console.log("async1 end")
        }

        async function async2(){
            console.log("async2")//这里相当于直接return
        }

        console.log("script start")
        
        setTimeout(function(){
            console.log("setTimeout")
        },0)

        async1()

        new Promise(function(resolve,reject){
            console.log("promise1")
            resolve()
        }).then(function(){
            console.log("promise2")
        })

        console.log("script end")
```

### 3.6事件队列 微任务 宏任务的理解

事件队列：事件队列是JS运行环境的一个数据结构 用于存储待处理和事件回调函数，是实现异步编程的关键机制之一 
工作原理：遇到异步操作（定时器。。）相关的回调函数不会立即执行，而是添加到事件队列当中，在当前的执行栈的同步任务结束后再从事件队列进行回调函数

宏任务：是由宿主环境（浏览器 node.js）发送的一些异步任务，通常是一些比较耗时的操作
比如定时器 网络请求，事件回调等
执行顺序：排队进行执行，一个一个执行，但是等到执行栈中的同步任务执行完后才会一个一个取出执行

微任务：微任务是一种在当前执行栈执行完毕后、下一个宏任务执行之前执行的异步任务。微任务通常用于处理一些需要在当前操作结束后立即执行的逻辑，并且希望在其他宏任务之前优先执行。常见的微任务有`Promise`的回调函数、`MutationObserver`的回调函数、`process.nextTick`（在 Node.js 环境中）等。
执行顺序：等到执行栈执行完后就会全部一个一个执行 执行完再执行宏任务

## 四.异常处理

### 4.1异常的应用场景

抛出异常之后除非有地方进行捕获要不然就会报错

```js
        function foo(){
            "asd".filter()
            //报错的后后面的代码就不会再执行 JS报错后就不会再进行
            console.log("后面的代码")
        }

        foo()
        console.log("+++++++++++")
        document.querySelector("button").onclick = function(){
            console.log("监听按钮点击")
        }
```

对函数进行封装的时候 传入的对象类型不i一样的时候可以主动抛出异常进行提示

### 4.2throw抛出异常类型

- number/string/Boolean
- 自定义对象类型
- 系统自带Error对象

### 4.3捕获异常

- 异常会一层一层的向上传播，如果被浏览器捕获就会报错
- finally
  不管最后是什么结果都会执行的代码





# 大tips：

## 1.setTimeout嵌套的时候会有时间的叠加

## 2.新创建宏微任务会立马会马上加入到微任务队列当中，不会等一个轮回，直到微任务是空的才会继续执行

## 3.eventloop

![image-20250513202856854](C:\Users\Lenovo\AppData\Roaming\Typora\typora-user-images\image-20250513202856854.png)

判断宏任务队列是否为空 

- 不空：执行最早进入队列的任务 
- 空：执行下一步

判断微任务队列是否为空

- 不空：执行最早进入队列的任务
- 空：执行下一步

