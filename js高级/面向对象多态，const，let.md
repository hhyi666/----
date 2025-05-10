### 一.面向对象的补充

### 1.1多态

- 严格意义的多态
  静态语言的多态：
  	1.必须有继承（接口）
  	2.必须有父类指向子类对象，这里相当于子类对象赋值给父类对象
- Js的多态 
  - 到处都是多态 不同数据类型进行同一个操作，表现出来不同的行为也是多态的表现

### 1.2对象字面量的增强

- 属性的增强
  对于前面出现的声明，再次定义对象时要使用可以不需要再次赋值直接使用

  ```js
  var name = "why"
  var age = 11
   var obj = {name,age,}
  ```

  

- 方法的增强
  原来对象里面定义方法

  ```js
  running : funtion(){}
  ```

  增强写法

  ```js
  running(){}
  ```

  **注意！**：箭头函数不能绑定this。不能直接在对象里面用箭头函数进行定义方法

- 计算属性名

  ```js
   var key = "address" + "city"
   var obj = {
             //计算属性名 这样就能直接写属性
             [key] : "chengdu"
          }
  //这样就能够直接写address和city
  ```

  

### 1.3数组和对象的解构

- 基本使用

  - 数组的解构

    ```js
    var names = ["aaa","bbb","qwe","ddd"]
    var [name1,name2,name3,name4] = names
    //这样就可以直接拿到对应的值
    ```

  - 对象的解构

    ```js
    var obj = {name:"huuyii",age:18,height:1.75,address : "Japan"}
    var {name,age,height} = obj
    ```

- 顺序

  - 数组解构具有严格的顺序

    ```js
    var [name1,name2,name3,name4] = names
    //如果有的值不需要
    var [name1,,name2,name3] = names
    //这样就直接跳过中间的值
    ```

  - 对象的解构没有顺序 什么顺序够可以

    ```js
    var {age,name,height} = obj
    ```

- 默认值（如果这个位置没有信息就是默认值）

  ```js
  //数组：
  var [name1,name2,name3 = "defalut"] = names
  //对象：
  var {
              height : wheight,
              name : wname,
              age : wage,
              address : waddress = "China",
          } = obj
          console.log(waddress)
  ```

  

- 对象的命名（能够进行重命名）直接后面加上：就行

  ```
  var {
              height : wheight,
              name : wname,
              age : wage,
              address : waddress = "China",
          } = obj
          console.log(waddress)
  ```

  

## 二.apply call bind的实现

apply方法后面是数据块

call方法后面是数据链

### 2.1apply和call的实现

apply实现

```js
function(name,age){
	clg(this,name,age)
}
Function.prototype.hyapply = funtion(thisArg,otherArgs){
	//进行边界检查
	thisArg = (thisArg === null || thisArg === undefined)?window:Object(thisArg)
   	//需要将this绑定到相应的函数上
    Object.defineProperty(thisArg,"fn",{
        enumerable:false,
        configurable:true,
        value : this
    })
    thisArg.fn(...otherArgs)//进行展开的意思
    delete thisArg.fn
}
//第一个记录对象
foo.hyapply({name:"huuyii"},["uuu",11])
```

call的实现

```js
function(name,age){
	clg(this,name,age)
}
Function.prototype.hycall = function(thisArs,...otherArgs){
	thisArg = (thisArg === null || thisArg === undefined)?window:Object(thisArg)
	Object.defineProperty(thisArg,"fn",{
        enumerable:false,
        configurable:true,
        value : this
    })
    thisArg.fn(...otherArgs)
    delete thisArg.fn
}
foo.hycall({name:"huuyii"},"uuu",10)
```



### 2.2apply和call的封装

观察上方的函数都有共同点，我们想到能不能再次封装一个函数将共同的部分再次封装

```js
function foo(name, age) {
	console.log(this, name, age)
}

Function.prototype.hyExec = function (thisArg, otherArgs) {
	thisArg = (thisArg === null || thisArg === undefined) ? window : Object(thisArg)

	//主要是这里还要进行this的绑定
	Object.defineProperty(thisArg, "fn", {
		enumerable: false,
		configurable: true,
		value: this
	})
	thisArg.fn(...otherArgs)
	delete thisArg.fn
}
//然后直接封装到原型里面，到时候直接调用
Function.prototype.hyapply = function(thisArg,otherArgs){
    this.hyExec(thisArg,otherArgs)
}

foo.hyapp()//调用
```

### 2.3bind函数的实现

bind函数是新创建一个函数，将原来函数的this绑定到新函数上

```js
funtion foo(name,age){
	clg(this,name,age)
}
Function.prototype.hybind(thisArg,...otherArgs){
	clg(this)//这个this默认绑定foo
	thisArg = (thisArg === null || thisArg === undefined)?window?Object(thisArg)
	
	Object.definePerproty(thisArg,"fn",{
		enumrable:false,
		configure:true,
        value:this
	})
    //这个里面还有函数，是为了后面能够继续往里面传入函数 eg：height
	return (...newArgs){
        var allArgs = [...newArgs,...otherArgs]
        thisArg.fn(...newArgs)
    }
}

var newFoo = foo.fybind({name:"huu"},"uuu",10)
newFoo(1.88,"chengdu")

```



## 三.额外知识补充

### 3.1新ECMA知识的补充

### 3.2var/let/const用法

let和const用途更加广泛

#### 词法环境！

还是有执行上下文栈和堆进行存储

而let和const的词法环境能够创建，但是在赋值之前不能够进行访问

![image-20250510142843137](C:\Users\Lenovo\AppData\Roaming\Typora\typora-user-images\image-20250510142843137.png)

#### 3.2.var 和 let/const区别和联系

- var的使用
  - 作用域提升，window全局对象，没有块级作用域等都是历史遗留问题
  - Js设计的缺陷
  - 加深对Js语言本身以及底层的理解
  - 使用最新的规范，不在使用var定义变量
- let const的使用
  - 推荐使用
  - 优先使用const 保证数据的 安全
  - 一个数据后续会重新赋值就是用let
  - 约定俗成的规范

#### 3.2.1const/let基本使用

- 基本使用
- 注意事项，不能重复定义

#### 3.2.2let/const没有作用域的提升

- 标识符在词法环境被创建的时候，会被创建出来，但是不能访问
- 作用域提升：在作用域内，可以提前访问

#### 3.2.3暂时性死区TDZ

#### 3.2.4不会添加window

- Global environment record
  - 合成的record
  - window
  - 声明式环境记录对象

#### 3.2.5块级作用域和应用

- let/const/function会形成块级作用域
- let的块级作用域
  - btnEl的for循环

#### 3.2.6细说作用域

- 全局作用域
  在全局作用域进行函数和变量的声明，该变量会自动生成window对象的属性和方法
- 函数作用域
  在JS中声明一个函数会创建一个属于函数本身的作用域集合，在函数声明的变量，无法从外部进行访问，而当函数执行结束后，这个作用域集合就会释放掉
- 块级作用域（ES6之后出现）
  块级作用域使用var进行变量的声明，块的外部可以进行访问到
  但是使用let/const 块的外面不能进行访问到
  eg： if语句当中，使用let外界也不能访问到
- 查找规则（一个一个找，直到找到或者是null（找到全局上））
  - inner
  - outer
  - 全局作用域

#### 3.2.7提升

1. 变量的提升
   JS预编译实际上已经存在a变量

   ```js
   a = 2
   clg(a)
   ```

   **注意：**预编译只会将变量声明提前，但是变量的赋值还是会按照原来的顺序进行执行

2. 函数的提升
   这样是可以调用函数

   ```js
   f()
   funtion f(){
   	clg("YES")
   }
   ```

   但是使用函数表达式进行声明并不会提升

   这里可以看成只是声明了一个变量，并没有声明函数

   ```js
   f()
   var f = funtion(){
   	clg("YES")
   }
   ```

   而且函数的提升大于变量的提升
   函数提升本质：就是函数声明和赋值，看成一个整体

   但是变量的提升：单单是声明，不进行赋值

3. 提升的补充

   ```js
   if(funtion f(){}){
   	clg(f)
   }
   ```

   这种情况输出是未定义的函数
   在表达式中声明函数，还是会作为表达式进行评估，不会视作函数声明，还是会做为表达式进行评估

   创建一个新的上下文环境，在这个环境声明这个函数，然后返回这函数对象。如果返回的对象没有被变量储存，这个新的环境上下文就会失效，释放f对象函数

   这里的if（）函数声明就是没有用变量进行储存，所以会被释放掉，就会报错

   这种情况，我们就可以在前面加上`f =`来避免这个问题

## 思考

### 1说说对面向对象多态的理解



### 2整理词法环境，环境记录等概念

Lexical Environments（词法环境）
有自己的inner outer指向不同的对象

1. Global code 源代码文件就是一个词法环境
2. eval 调用eval也会创造自己的词法环境
3. with结构：创建自己的词法环境
4. catch结构：创建自己的词法环境

![image-20250510143906672](C:\Users\Lenovo\AppData\Roaming\Typora\typora-user-images\image-20250510143906672.png)

### 3说说let，const和var的区别

### 4理解let块级作用域以及作用

简单使用for循环进行证明
对于我们只会使用var来说，我们原来想要监听每一个按钮的信息
我们方法：

1.使用立即执行函数进行寻找
也是相当于实现了自己的作用域

```js
(function(m){
	btnEl.onclick = funtion(){
		clg(`${m}点击`)
	}
})(i)
```

2.给对象加上index的属性
后面调用可以直接进行使用

```
btnEl.index = i+1//绑定index
```



但是我们现在可以直接使用块级作用域进行寻找

每个let会创建自己的作用域，而且我们里面有函数引用，可以防止被清除

```js
for (let i = 0; i < btnEls.length; i++) {
     		var btnEl = btnEls[i];
            btnEl.onclick = function () {
                console.log(`${i}点击`)
            }
        }
```

使用let块级作用域方便很多

### 5局部作用域和块级作用域的区别

局部作用域：

- 定义：由函数进行创建，变量在函数内部访问
- 特点：
  - 内部定义的只能在内部进行访问
  - 变量提升

块级作用域

- 由代码块创建的作用域，只能在内部看见
- 特点
  - 只能通过let和const声明
  - 没有变量提升
- 可以避免变量泄漏，防止闭包陷阱，提升代码的可读性