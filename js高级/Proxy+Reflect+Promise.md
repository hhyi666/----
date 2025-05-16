## 一.Proxy

### 2.1Proxy

就是拦截操作，并且做出一些反应

#### 2.1.1Object.defineProperty

 原来的监听的方法

- 写法

  ```js
          const keys = Object.keys(obj)
          for (const key of keys) {
              let value = obj[key]
              Object.defineProperty(obj,key,{
                  set : function(newValue){
                      console.log(`监听：${key}设置了新的值:${newValue}`)
                      value = newValue
                  },
  
                  get : function(){
                      console.log(`监听：${key}被访问`)
                      return value
                  }
              })
          }
  ```

  局限：1.对于原来没有的对象我们不能进行监听，不能监听完整的对象，只能监听访问和改变的属性 2，这个属性的初衷并不是这个，尽量不要使用这个

- 和proxy的区别

  - 拦截对象：define只能拦截单个对象，但是proxy能够拦截整个对象的所有操作和调用
  - 新增对象：无法拦截新增属性，需要手动对每个新属性调用函数，proxy自动拦截所有属性
  - 深层对象：需要使用递归才能实现深层次拦截，proxy通过嵌套实现深层次的拦截更加优雅

- 使用define的情况：

  - 需要兼容就浏览器
  - 仅需拦截少数属性和简单的场景
  - 实现简单的数据劫持 （Vue2的响应式）

- 使用proxy的情况

  - 需要拦截的多种操作
  - 处理动态的属性（新增/删除）
  - 实现复杂的元编程或者自定义对象行为
  - 项目不依赖IE兼容性

#### 2.1.2proxy的基本使用

- new Prixy（target，handler）

  ```js
          const objproxy = new Proxy(obj,{
              //添加捕获器
              get : function(target,key){
                  console.log(`监听：监听${key}的获取`)
                  return target[key]
              },
              set : function(target,key,value){
                  console.log(`监听：设置${key}的值`)
                  target[key] = value
              }
          })
  ```

  

- 操作Proxy对象

  ```JS
  		const fooProxy =  new Proxy(foo,{
              apply : function(target,thisArg,otherArgs){//监听apply
                  console.log("监听：apply操作")
                  target.apply(thisArg,otherArgs)
              },
  
              construct : function(target,otherArgs){//监听new
                  console.log("监听了new操作")
                  console.log(target,otherArgs)
                  return new target(...otherArgs)
              }
          })	
  ```

  

#### 2.1.3Proxy捕获器的使用

- set

  ```
   set: function (target, key, value) {
                  console.log(`监听：设置${key}的值`)
                  target[key] = value
              },
  ```

  

- get

  ```
  get: function (target, key) {
                  console.log(`监听：监听${key}的获取`)
                  return target[key]
              },
  ```

  

- has

  ```
  has : function(target,key){
                  console.log(`监听：判断${key} in 属性`)
                  return key in target
              }
  ```

  

- deleteProperty

  ```
   deleteProperty : function(target,key){
                  console.log(`监听：删除${key}属性`)
                  delete target.name
              },
  ```

- 。。。有很多

#### 2.1.4apply /constructor

就是监听apply和new操作

```js
        function foo(num1,num2){
            console.log(this,num1,num2)
        }

        const fooProxy =  new Proxy(foo,{
            apply : function(target,thisArg,otherArgs){//监听apply
                console.log("监听：apply操作")
                target.apply(thisArg,otherArgs)
            },

            construct : function(target,otherArgs){//监听new
                console.log("监听了new操作")
                console.log(target,otherArgs)
                return new target(...otherArgs)
            }
        })
        
        fooProxy.apply("huu",[111,222])
        new fooProxy("aaa","bbb")
```

## 二.Reflect

### 2.2.1设计的初衷

- 有些Reflcet的函数原来是放在Object上的但是有的时候Object不适合放这么多的类函数，这是我们就想要再定义一个对象来储存这些函数
- 还有的是对于一些在Object上的函数我们有时候不知道是否执行成功，所以我们此时就需要Reflect来返回鉴定是否创建成功 Reflect大部分返回的都是Boolean类型，能够更好的判断

### 2.2.2演示Reflect返回值

```js
        if(Reflect.deleteProperty(obj,"name") ) console.log("delete sucess")
        else console.log("delete false")
```



### 2.2.3Reflect和Proxy一起使用的好处

- 不直接操作原对象

- 有返回值

- 改变访问器中的this指向

- ```js
  const objProxy = new Proxy(obj,{
              set : function(target,key,value,receiver){
  
                  //这个代码规范吗？？
                  // 弊端：1.这里还是在操作原对象
                  //2.这里不知道是否操作成功 ？
                  // target[key] = value
  
                  //好处一：代理对象目的：不在直接操作原来的对象
                  //间接操作
                  // Reflect.set(target,key,value)
  
                  //好处二 ：reflect返回的是Boolean类型，能够判断是否操作成功
                  const sucess = Reflect.set(target,key,value)
                  if(!sucess)throw new Error("set false")
              },
              get : function(target,key,receiver){
  
              }
          })
  ```

- ```js
  const objProxy = new Proxy(obj,{
              set : function(target,key,value,receiver){
                  // console.log(receiver === objProxy)
                  console.log("proxy方法被调用")
                  
                  const sucess = Reflect.set(target,key,value,receiver)//相当于转换到代理对象上
                  //这里后面加上reveiver可以对原来对象的this绑定进行改变
                  //将上面的方法this绑定到代理对象上面，这样的活这个监听就会被触发两次
                  //1.调用原来的set函数时候调用 2，将this进行绑定赋值再次触发
  
  
                  if(!sucess)throw new Error("set false")
  
                  //好处三：
                  //receiver 就是 外层Proxy对象
                  //Reflect.set .get 最后一个参数可以决定对象访问器setter和getter中this的指向
  
              },
              get : function(target,key,receiver){
                  console.log("get方法被调用")
                  return Reflect.get(target,key,receiver) //同样的这里的get方法也会被调用两次
              }
          })
  
          //操作代理对象
          objProxy.name = "huu"
          console.log(objProxy.name)
  ```

  这里使用this进行绑定，调用Proxy的拦截器的时候我们可以传入receiver进行操作，能够转换原来对象中的对象的this绑定，能够根据业务进行调整

  ```js
          const obj = {
              _name : "huuyii",
              set name(newValue){
                  console.log(this)
                  this._name = newValue//这里this的改变也会调用代理对象里里面相应的函数
              },
              get name(){
                  return this._name
              }
          }
           const objProxy = new Proxy(obj,{
              set : function(target,key,value,receiver){
                  // console.log(receiver === objProxy)
                  console.log("proxy方法被调用")
                  
                  const sucess = Reflect.set(target,key,value,receiver)//相当于转换到代理对象上
                  //这里后面加上reveiver可以对原来对象的this绑定进行改变
                  //将上面的方法this绑定到代理对象上面，这样的活这个监听就会被触发两次
                  //1.调用原来的set函数时候调用 2，将this进行绑定赋值再次触发
  
  
                  if(!sucess)throw new Error("set false")
  
                  //好处三：
                  //receiver 就是 外层Proxy对象
                  //Reflect.set .get 最后一个参数可以决定对象访问器setter和getter中this的指向
  
              },
              get : function(target,key,receiver){
                  console.log("get方法被调用")
                  return Reflect.get(target,key,receiver) //同样的这里的get方法也会被调用两次
              }
          })
  ```

  

### 2.2.4Reflect的construct的用法

```js
		function Person(name,age){
            this.name = name
            this.age = age
            this.running = function(){
                console.log("running")
            }
        }

        function Student(name,age){
            //借用构造函数
            // Person.call(this,name,age)
            const _this = Reflect.construct(Person,[name,age],Student)
            return _this
        }
```

想要创建一个对象是Student的子类但是具有Person对象的属性和方法，这个时候我们就可以用Reflect.construct进行操作（可以对class进行操作）直接这样操作更加方便

## 三.Promise

### 3.1异步代码存在的困境

- 回调地狱，多层回调函数嵌套的问题，使得代码变得难以阅读维护和调试
- 处理复杂
- 并发问题，可能涉及数据冲突，数据改变但是不及时做出反应
- 调试困难

### 3.2使用Promise进行解决

使用promise进行解决异步问题
成功使用resolve进行返回
失败使用reject进行返回

```js
        function execCode(counter) {

            //创建promise //这里自动创建两个回调函数
            const promise = new Promise((resolve, reject) => {
                setTimeout(() => {
                    console.log("Hello world")
                    console.log("999")
                    if (counter <= 0) { // 失败的情况
                        // failCallback(`${counter}有问题`)

                        //失败的回调
                        reject(`${counter}有问题`)
                    } else {
                        let sum = 0
                        for (let i = 1; i < 10; i++) {
                            console.log(i)
                            sum += i
                        }
                        //在某个时刻只需要回调传入的函数 内部的做完了，告诉外界做完了
                        // successCallback(sum)


                        //成功的回调
                        resolve(sum)
                    }

                }, 3000)
            })
            return promise
        }
	execcode(255).then(value => {
       	console.log("成功",value)
    }).catch(err => {
       	console.log("失败",err)
    })
```



### 3.3Promise的三种状态

- pending待定状态，没有调用的时候

- fulfilled 操作成功

- rejected 失败状态

  ！！注意：promise的状态确定了就不会进行更改

### 3.4resolve不同的值（三种不同的回传值）

- 回传的是普通值 包括不限于：函数，数组，。。

- 回传resolve（promise）
  这样的话回传的状态就是根据传入的promise的状态决定的

- 回传resolve（thenable）了解

  如果返回的是对象，并且对象中有then方法，那么就会执行then方法
  并且根据then方法的结果决定promise的状态

### 3.5then和catch方法的补充

- then和catch都可以传递两个参数

  - 都可以直接传入正确的结果和错误的结果，但是代码的可读性不强

  - ```js
            promise.then(res => {
                console.log("成功回调",res)
            },err => {
                console.log("失败回调",err)
            })
    ```

- promise返回的值都可以调用不同的对应的函数
  像这个我们返回resolve函数的之后这几个都会触发

  ```js
          promise.then(res => {
              console.log(res)
          })
          promise.then(res => {
              console.log(res)
          })
          promise.then(res => {
              console.log(res)
          })
          promise.then(res => {
              console.log(res)
          })
  ```

- 注意：如果没有设置监听错误的情况，会报错

### 3.6细节的补充

#### 1实例方法

##### 1.1.then方法返回新的Promise

- then中的回调来进行决定

- ```js
  promise.then(res => {	
  	console,log(res)
  	return "bbb"
  }).then(res => {
  	console.log(res)
  	return "ccc"
  })
  ```

  会产生这样的链式调用的效果

- ！！！注意过程的执行顺序

  ```js
          promise.then(res => { // then返回新的promise方法 链式中的then时在等待新的决议
              console.log("第一次then方法",res)
              return "bbb"
          }).then(res => {
              console.log("第二次then方法",res)
              return "vvv"
          }).then(res => {
              console.log("第三次then方法",res)
              return "lll"
          }).then((res) => {
              console.log("第四次then方法",res)
          })
  
          promise.then(res => {
              console.log("添加第二个then方法")
          })
  ```

  这个过程的执行结果就是第一个和最后一个会执行，因为有一开始只有这两个进行决议

- then方法传入回调函数的返回值的类型

  - 普通值

  - 新的promise 决议也是根据这个新的promise进行设置

  - 返回对象thenable 返回的对象是有then方法，会等待then方法执行，根据这个进行操作返回决议

    ```js
    promise.then(res => {
                console.log("第一个Promise的then方法：",res)
                //1，新的Promise
                // return newPromise//等待决议成功在传递
                //使用新的Promise进行返回
                //这里默认返回undefined
    
                //2.普通值
                // return "bbb"
    
                //3.返回对象 对象里面有then的值
                return {
                    then : function(resolve){//这里传入resolve的方法
                        resolve("返回的是对象")
                    }
                }
            }).then(res => {
                console.log("第二个Promise的方法：",res)
            })
    ```

- 

##### 1.2.catch方法返回新的promise

- catch执行，前面的某一个promise reject执行就会进行回调

- catch返回值也是promise 由catch传入的回调来决定

- 从then转换到catch身上 catch捕获最近的异常信息
  可以中断的信息：return throw yeild

  ```js
  promise.then(res => {
  	console.log("then第一次进行回调")
  	return "aaa"
  }).then(res => {
  	console.log("第二次")
  	throw new Error("异常") //这是就会直接转到catch的身上
  })
  ```

  

##### 1.3finally方法 ES9之后出现

就是不管是fulfilled还是rejected 最后都会执行的代码 
注意：这个是等决议完成之后才会执行，注意顺序

#### 2.类方法

定义：构造函数或者类本身就有的方法
实例方法：新创建的实例上可以调用的方法

##### 2.0resolve reject方法

- 当我们已经有对应的结果想要通过Promise传出去，就直接使用resolve

  ```js
  		const studentList = []
  
          Promise.resolve(studentList).then((value) => {//相当于new P操作直接执行resolve操作
              console.log(value)
          })
  ```

  

##### 2.1all方法

- 等到所有的Promise由resolve结果，拿到数组 ，根据全部的进行判断

- 如果过程中有一个reject，那么all promise的值就是reject

- ```js
          const p1 = new Promise((resolve,reject) => {
              setTimeout(() => {
                  reject("error")
                  resolve("p1 solve")},3000)
          })
          const p2 = new Promise((resolve,reject) => {
              setTimeout(() => {resolve("p2 solve")},4000)
          })
          const p3 = new Promise((resolve,reject) => {
              setTimeout(() => {resolve("p3 solve")},5000)
          })
                  Promise.all([p1,p2,p3]).then((res) => { //res是一个数组类型，保存每一个结果
              console.log("all promise res",res)
          }).catch((err) => {
              console.log(err)
          })
  ```

  

##### 2.2allSettle方法

- 等到所有的Promise操作完，拿到数组=>元素是对象[{status :	,value/reason:	},...............]
  成功有返回值，失败有返回的失败的原因 反应的信息更加充分

- ```js
          const p1 = new Promise((resolve, reject) => {
              setTimeout(() => {
                  reject("error")
                  resolve("p1 solve")
              }, 3000)
          })
          const p2 = new Promise((resolve, reject) => {
              setTimeout(() => { resolve("p2 solve") }, 4000)
          })
          const p3 = new Promise((resolve, reject) => {
              setTimeout(() => { resolve("p3 solve") }, 5000)
          })
          Promise.allSettled([p1,p2,p3]).then(res => {console.log(res)})
  ```

  

##### 2.3race方法

- 竞赛：只要有结果就返回，不管这个结果成功fulfilled还是失败rejected

- 拿到一个结果停止 后续不再执行

- ```js
          const p1 = new Promise((resolve, reject) => {
              setTimeout(() => {
                  reject("error")
                  resolve("p1 solve")
              }, 3000)
          })
          const p2 = new Promise((resolve, reject) => {
              setTimeout(() => { resolve("p2 solve") }, 4000)
          })
          const p3 = new Promise((resolve, reject) => {
              setTimeout(() => { resolve("p3 solve") }, 5000)
          })
           Promise.race([p1,p2,p3]).then(res => console.log(res))
          .catch(error => console.log(error))
        
  ```

  

##### 2.4any方法

- 任意：会一直等待，等到一个fulfilled，如果没有就会生成一个错误的对象

- 拿到全部的进行判断

- ```js
          Promise.any([p1,p2,p3]).then(res => {console.log(res)})
          .catch(err => console.log(err))
  ```




#### 3.注意：then期待传入的是函数，如果不是函数那么，会发生透传，就是上面的值会连续的传到下面

#### 4.promise的状态一旦改变就不会改变

#### 5.finally的回调函数是不能接收Promise的结果的 undefined

#### 6.如果最后访问这个Promise最后返回的就是finally的返回值，如果finally没有返回值那么就访问上一个then或者catch的返回值，undefined

## 思考：

### 1.说出proxy和Object.defineProperty（Vue2的实现）的区别

- 功能差异
  - 拦截范围：proxyES6之后引入，能拦截对象属性的读取，写入，删除，函数调用。。。以及in操作符
    for in循环等方法，提供更加细致的全面的拦截
    Object.definP只能拦截单个对象属性的读取和写入操作，无法对对象的整体进行拦截，例如对整个对重新赋值，不会触发set的拦截，新属性不能触发拦截
  - 可变性控制
    Pro能够控制对象的可变性，比如禁止对某一个对象的赋值，实现更加严格的对象保护和约束
    P没有
- 配置方法：
  - Pro一次设置监听多个对象，代码简洁
    P需要循环单独设置，结构复杂
- 性能：
  - Pro拦截机制复杂，存在一定的开销，访问对象的属性时更明显
  - P没有额外的代理层，性能相对较好
  - Pro相对的兼容性没有那么好
- 应用场景
  - P对对象进行一次定义修改，对于响应式要求不高并且兼容性要求高的项目
  - Pro需要动态改变对象的行为，实现复杂的行为绑定，虚拟DOM等
    用于提升性能和优化响应式实现

### 2.说说Reflect的作用和为什么需要他

- 使得对象规范化，一致化
- 配合Proxy实现代理操作，Reflecct能够返回Boolean类型的值作为监听
- 返回Boolean类型，更加合理
- Object操作函数化

### 3.promise的作用和使用方法

- 处理异步操作的时候，我们需要对清晰的知道结果是什么，是否成功，以及失败的原因
- 解决回调地狱
- 统一错误的处理：使用catch方法捕获异步操作中的错误，能集中处理，避免在每个异步操作回调中重复写错误的代码提高代码的可维护性
- 控制异步流程

### 4.理解Promise

相当于保姆，我们能够任命他去完成一些任务，就相当于几个异步任务

有时间的延迟，这时我们就能有promise进行书写

注意：后续还是异步任务就需要返回的是一个新的promise对象，如果不是，就会返回一个结果就行，就是同步函数

创建promise的时候创建的方法

- new promise(fn)
- Promise.resolve()



# Promise面试题

1.使用Promise实现每隔1秒输出1,2,3

```js
async function print(){
	for(let i = 1;i<=3;i++){
		await new Promise((resolve) => setTimeout(resolve,1000))//暂停1s再返回
		console.log(i)
	}
}
```

将数组中的每一个元素转换为一个延迟执行的Promise，并通过Promise串联起来

```js
const arr = [1, 2, 3];
arr.reduce((p, x) => p.then(() => new Promise((r) => setTimeout(() => {
    console.log(x);
    r();
}, 1000))), Promise.resolve()).then(() => {
    console.log('All numbers printed');
});
```

