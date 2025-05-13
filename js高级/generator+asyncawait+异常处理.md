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



## 二.async/await

### 2.1异步函数async

### 2.2异步函数的返回值

- 普通值
- promise
- thenable

### 2.3async中使用的await

- await表达式返回Promise
- await后续的代码会等待有resolve结果，才继续执行

## 三.事件循环/队列

### 3.1进程和线程

### 3.2Js是单线程的

### 3.3事件队列/循环

### 3.4宏任务和微任务

- 调度过程
  - 在执行下一个宏任务之前会清空微任务队列

### 3.5面试题：Promise/async/await

## 四.异常处理

### 4.1异常的应用场景

### 4.2throw抛出异常类型

- number/string/Boolean
- 自定义对象类型
- 系统自带Error对象

### 4.3捕获异常

- 
- finally