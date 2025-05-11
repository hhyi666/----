# ES6之后新增内容

## 一.ES6中的内容

### 1.1模板字符串

ES6之前拼接字符串进行输出很麻烦

```js
const name = "huy"
const age = 11
const info = "my name is " + name + " age is " + age//很麻烦
console.log(info)
```

ES6之后能够使用模板字符串就好很多

- 基本用法

  ```js
  const name = "huy"
  const age = 11
  const info = `my name is ${name}, age is ${age}`
  console.log(info)
  ```

  

- 标签模板字符串
  函数调用的时候这样也可以传入参数
  使用$传入的参数也会作为对象加入剩余参数中，除了使用$引用的自己本身也是一个对象，模板字符串会自动对字符串进行拆分
  作用：有助于后续实现`css in js `或者`all in js`

  ```js
  function foo(...args){
  	clg(...args)
  }
  foo`my name is ${name},age is ${age},height is ${1.88}`
  ```

  所有的静态字符串会被拆分出来合并成为一个数组，作为第一个参数传入目标函数，其他的就作为rest参数传入
  这里甚至可以引用标签进行操作（看自己的脑洞有多大，能够自由的实现东西）

### 1.2函数增强

- 默认参数
  转入undefined或者null的时候就会使用默认值

  ```js
  function foo(arg1 = "默认值",arg2 = "默认值"){
  	clg(arg1,arg2)
  }
  ```

  规范：

  - 想要设置默认参数的元素传入函数的位置尽量往后放

  - 设置的默认参数的是不会计算在length里面的，并且设置默认参数后面的也不会计算length

  - 剩余参数放在最后，默认参数的后面

  - 还可以使用解构进行表示

    ```js
    function foo({name = "huu",age = 18} = {}){
    	console.log(name,age)
    }
    ```

  优点：提升了函数的灵活性，可读性，减少了代码的冗余

- 剩余参数
  捕获函数的剩余参数
  剩余参数和argument的区别

  - 剩余参数没有对应形参的是实参，argument对象包含传给函数的所有实参
  - argument对象不是一个真正的数组，rest参数是一个数组，可以进行数组操作
  - argument是早期ES中方便去获取所有参数提供的一个数据结构，rest参数是ES6提供且希望以此替代argument
  - 剩余参数放在最后一个位置

- 箭头函数的注意事项

  - `funtion`定义的函数有两个原型
    `prototype`指向父类`Object`
    `__proto__`指向`Function.prototype`

  - 箭头函数没有显式原型，也没有this，super，argument 
    当访问this的时候会穿越到上层进行寻找

    ```js
    var bar = ()=>{}
    console.log(bar.__proto__)////记住指向Function.protytype
    console.log(bar.prototype)//没有显式原型
    ```



### 1.3展开运算符

- 对象字符串的创建也可以使用展开运算符
- 还可以进行字符串的复制

### 1.4引用赋值/浅拷贝/深拷贝（一定掌握）

- 引用赋值
  ![image-20250511094009390](C:\Users\Lenovo\AppData\Roaming\Typora\typora-user-images\image-20250511094009390.png)
  直接将原来对象的地址复制给新创建的对象
  新对象进行更改的时候会对原对象也进行更改

  ```js
          const obj = {
              name: "why",
              age: 18,
              height: 1.88,
  
              ruinning() {
                  console.log("first")
              }
          }
          const info1 = obj
  ```

- 浅拷贝
  ![image-20250511093956396](C:\Users\Lenovo\AppData\Roaming\Typora\typora-user-images\image-20250511093956396.png)

  创建新对象的时候，会创建新的地址存储原来对象的内容，并将新地址转给新创建的对象，这样就不会对原来对象产生影响
  但是深层次的引用对象不会改变深层次的地址
  其中展开运算符就是一种浅拷贝

  ```js
          const obj = {
              name: "why",
              age: 18,
              height: 1.88,
  
              ruinning() {
                  console.log("first")
              }
          }
  		const info2 = {
              ...obj
          }
          info2.name = "ooo"
          console.log(info2.name)
          console.log(obj.name)
  ```

- 深拷贝

  ![image-20250511094027837](C:\Users\Lenovo\AppData\Roaming\Typora\typora-user-images\image-20250511094027837.png)

**一切都是新的**
可以用 第三方库，手搓，js机制转成JSON实现

```js
        const info3 = JSON.parse(JSON.stringify(obj))//obj先转换成JSON文件，
        // 在转换回来，都是重新生成的，都是新的地址用来存储原来的声明
        console.log(info3.name)
```

包括原来的对象，以及深层次的对象都是新的

### 1.5数字连接符

大数字可以使用下划线进行连接

### 1.6Symbol的使用

解决命名的弊端

- ES6之前对象的属性是字符串形式，容易造成命名冲突
- 某些情况下，想要在原来的对象加上新的属性和值，容易造成冲突

所以symbol出现了

symbol函数每次能够生成独一无二的值

```js
		const s1 = Symbol()
        const s2 = Symbol()

        //1.加入到对象里面
        const obj = {
            name : "huu",
            age : 18,
            [s1] : "aa",
            [s2] : "bb"
        }

        const obj1 = {}
        obj1[s1] = "aaa",
        obj1[s2] = "bbb"

        const obj2 = {}
        Object.defineProperty(obj2,"[s1]",{
            value : "aaa"
        })
```

`Symbol.for()`

Symbol有description能够生成相同的值，但是必须使用`Symbol.for()`进行生成

```js
        const s3 = Symbol("aaa")//传入描述
        console.log(s3.description)//拿到对应的描述
        const s4 = Symbol(s3.description)
        console.log(s3 === s4)//false

        //相同的key 通过Symbol。for可以生成相同的Symbol值
        const s5 = Symbol.for(s3.description)
        const s6 = Symbol.for(s3.description)
        console.log(s5 === s6) // 这种情况下生成的Symbol是相等的··
```



`Symbol.keyFor()`

能够传入`Symbol`返回设置的description

```js
console.log(Symbol.keyFor(s5))
```



Symbol不能使用for in 或者 for of进行遍历

```js
let symbol = Symbol("test")
let obj = {
	name : "huu",
	[symbol] ; "test"
}

//这样就只能访问到name
for(const key of obj)console.log(key)

//也是只能访问到name
for(const key in obj)console.log(key)
```



`Object.getOwnPropertySymbols`

可以使用这个获取Symbol的属性

不想要被遍历的对象可以使用Symbol进行保护

### 1.7Set/WeakSet

- 内容不能重复
- WeakSet和Set的区别
  - 只能存放对象
  - 对对象是弱引用 -> (对象可能会被（GC）回收)
  - ！！不能遍历

### 1.8Map/WeakMap

- key可以是对象类型
- WeakMap和Map的区别
  - key必须是对象
  - 对对象是弱引用
  - ！！！不能进行遍历

## 二.ES7~ES11

### 2.1ES7

- includes鉴定是否属于
  返回值是Boolean
  弥补对NaN判断不准确的弊端
- ** 指数运算符

### 2.2ES8

- `Object.values`
  用于输出对象的value的值
  注意：如果对象的key值可以排序，可以按照key值进行从小到大进行排序

  ```js
      <script>
          //ES5引入的是Object.keys方法，返回的是一个数组，成员是所有可遍历（enumerable）的属性的key
          const obj1 = {foo : `bar`,baz : 42}
          const obj2 = {100:"a",2:"b",7:"c"}
          console.log(Object.values(obj1))//这个是返回values
          //注意如果属性名为数值的属性，是按照数值大小，从小到大进行遍历，
          console.log(Object.values(obj2))
  
          console.log(Object.entries(obj2))
          //返回的是键值对数组，每一对是一个元素
          //能排序的就是排序进行输出
          
      </script>
  ```

  

- `Object.entries`
  能够返回一个键值对数组，每个元素都是一组键值对

  ```js
          console.log(Object.entries(obj2))
          //返回的是键值对数组，每一对是一个元素
          //能排序的就是排序进行输出
  ```

  

- String `padStar`和`padEnd`
  用于填充字符串 任意决定从前面或者从后面字符串的长度

  ```js
      <script>
          //padstart
          const minute = "15".padStart(2,"0")//在前面进行填充，保证有两位
  
          //padEnd向后填充
          const second = "33".padEnd(2,"0")
          console.log(`${minute}:${second}`)
          //但是我想要两位数怎么搞？进行填充
  
  
          //应用场景2；对敏感数据进行格式化 身份证 银行卡。。。
          let IDcard = "132345200607895639"
          const sliceID = IDcard.slice(-4)//进行截取
          IDcard = sliceID.padStart(IDcard.length,"*")
          const cardEl = document.querySelector(".card")
          cardEl.textContent = IDcard
      </script>
  ```

  

- Trailing Commas函数的后面可以新加逗号 
  没什么说的就是可以往最后加上逗号

### 2.3ES10

- flat / flatMap

  - flat的使用 ： 将一个数组按照指定的递归深度，将遍历的元素和子元素中的元素组成一个新的数组，进行返回
    这里的深度就是展开几层嵌套，简单说就是消除几层等级相同的括号

  ```js
          const nums = [10,20,[111,222,333],[[123,123],[222,333],777],888]
          const newNum1 = nums.flat(1)//指定深度，进行平坦化
          //这里的深度就是展开几层嵌套，就是消除等级相同的括号
          console.log(newNum1)
  ```

  - flatMap的使用

    - 先进行Map的映射，在进行flat操作

    - flat操作的深度就是1

    - 要想将这个数组的元素对空格进行切割

      ```
      const messages = ["Hello world","aaa ccc","bbb daada"]
      const finalMessage = message.flatMap(item => item.split(" "))
      clg(finalMessage)
      //这样就能直接进行切割
      ```

      注意：split函数直接就能对数组想要切割的进行切割

- Object.formEntries

  - 这个可以将使用entries转换的对象数组转换回来，再转换成为对象，只要是对象数组就可以进行转换

  - ```js
            //应用
            const searchString = "?name=why&age=18&height=1.88?"
            const params = new URLSearchParams(searchString)//解析字符串
            //直接将searchString转换成为对应的对象的值
            console.log(typeof params) //是一个可迭代对象 ,后面就需要使用get进行访问相对应的值
            console.log(params.get("name"))
            console.log(params.get("age"))
            console.log(params.entries())//可迭代对象
            //使用的时候默认就是entries 两个是等价的
            //默认就是对象类型
            for (const item of params) {
                console.log(item)
            }
            const paramsObj = Object.fromEntries(params) //转化成为对象类型
            console.log(paramsObj)
            console.log(paramsObj.name)
    ```

    

- trimStart / trimEnd
  简单，就是清除字符串前面或者后面的空格

### 2.4ES11

- BihInt - 》 n

  - 可以使用大数+n的方法表示大数

- 空值合并运算符 ？？

  - ```js
    let info = null
    info = info ?? "默认值"
    console.log(info)
    ```

  - 如果对象是null || undefined 就能够直接返回默认值

- 可选链的使用

  - 函数调用时也需要
  - 就是.? 函数的调用需要先判断有没有这个函数存在，再进行调用

  ```js
      <script>
          const obj = {
              name : "why",
              age : 18,
              friend : {
                  name : "aaa",
                  running :  function(){
                      console.log(" running ")
                  }
              }
          }
  
          //1.直接调用
          // obj.friend.running()
          //真实开发不一定有这个函数
          //需要加上一个判断
  
          //2.if判断，（麻烦）
          // if(obj.friend && obj.friend.running){
          //     obj.friend.running()
          // }
  
          //3.可选链的写法
          //?.有这个东西就进行执行,注意调用也得加上
          obj?.friend?.running?.() //减少if语句的使用
          //如果不存在 表达式会短路 返回undefined
  
      </script>
  ```

  

- for in 标准化遍历对象的key值

### 2.5ES12

- FinalizationRegistry
  就是监听是否被回收

  ```js
  let obj = {
  	name : "huuyii"
  	age : 12
  }
  let info = {}
  const finalRegistry = new FinalizationRegistry((value) => {
  	console.log(`${value}被回收触发这个机制`)
  })
  finalRegistry.register(obj,"obj")//给对象注册这个监听
  finalRegistry.register(info,"info")
  obj = null
  info = null//当被回收的时候就会执行上面的代码
  ```

  

- WeakRef（弱引用）

  ```js
  let info = {name : "huuyii",age : 18}
  let obj = new WeakRef(info)
  setTimeout(() => {	
  	console.log(obj.deref().name)
  })
  ```

  弱引用不能直接拿到对象的值

  - objRef.deref(）
    可以对弱引用进行解码来访问原来对象的值

- 逻辑运算符

  - ||= 
  - ？？=
  - &&=

- replaceAll
  字符串处理函数
  能够替代字符串中所有的目标字符

### 2.6ES13

- at
- Object.hasOwn
  - Object.prototype,hasOwnProperty
- class成员
  - public instance of
  - public static fields
  - private instance fileds
  - private static fields
  - static block



