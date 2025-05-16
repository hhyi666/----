# **this的绑定**

this解决的问题

this提供了一种更加优雅的方式来隐式传递了一个对象的引用，因此可以将API设计的更加简洁并且易于复用

## **一.this的绑定规则**

### **1.1绑定规则**

- 默认绑定
  在非严格模式下，默认绑定的tihs指向全局对象，严格模式下this指向indefined

  ```js
  function foo(){
  	console.log(this.a) //this指向全局对象
  }
  
  var a = 2
  foo(); // 2
  
  function foo2(){
  	"use strict"
  	foo(); //严格模式下调用其他的函数，不影响默认绑定
  }
  foo2()// 2
  ```

  对于默认绑定来说，决定this绑定对象的是函数体是否处于严格模式，严格指向undefined，非严格指向全局对象，避免某些严格面试题挖坑

- 隐式绑定
  函数在调用位置，是否由上下文对象，如果有，那么this就会隐式绑定到这个对象上

  ```js
  function foo(){
  	console,log(this,a)
  }
  var a = "Oops,global"
  let obj2 = {
  	a : 2,
  	foo : foo
  }
  let obj1 = {
  	a : 22,
  	obj : obj
  }
  obj2.foo() //2 this指向obj2
  obj1.obj2.foo() // 2 this指向最后一层的函数调用
  
  //隐式绑定丢失
  let bar = obj.foo
  bar() //Oops,global 指向全局
  ```

  隐式绑定丢失的问题，实际上就是函数调用的时候，并没有上下文对象，只有函数的引用，会导致隐式绑定丢失的问题，同样的问题回调函数中也有，并且隐蔽

  ```
  test(obj2.foo)//传入函数引用的时候，调用的时候也是没有上下文对象
  ```

  

- 显示绑定
  在某个对象上强制调用函数，从而将this绑定到这个对象的身上
  通过apply call bind将函数的this绑定到指定对象的身上

  ```js
  function foo(){
  	console.log(this,a)
  }
  let obj = {
  	a : 1
  }
  foo.call(obj) // 1
  ```

  当传入的不是对象，传入的是一个原始值（字符串，bool，数字）当作this的对象，这个原始值转换成他的对象形式

  当传入的是null或者undefined的时候作为this绑定的对象传入call apply bind 这些值会被忽略，实际应用的是默认绑定规则

- new绑定
  在js当中，实际上不存在所谓的构造函数，只有对函数的构造调用
  new ：1，创建一个新的对象 2，这个新对象会被执行[[prototype]]连接 3，这个对象会被绑定到函数调用的this 4，如果函数并没有返回其他的对象，那么new表达式中的函数调用会自动返回这个新对象
  使用构造函数调用的时候，this会自动绑定在new期间创建的对象上

  ```js
  function foo(a){
  	this.a = a
  }
  let bar = new foo(2)
  console.log(bar.a) //2 
  ```

  

### **1.2显示绑定**

- apply/call
- bind

### **1.3内置函数的规则**

- 经验

### **1.4规则的优先级**

- new
- bind
- apply/call
- 隐式绑定
- 默认绑定

### **1.5规则之外的情况**

- undefined
- 间接函数引用（了解）



## **二.箭头函数的使用**

箭头函数中的this继承自它外面的第一个不是箭头函数的this的指向

箭头函数的this绑定一旦绑定了上下文，就不会被任何代码改变

### **2.1箭头函数写法**

- 基本写法
- 优化写法
  - 只有一个参数的时候，可以省略（）
  - 只有一行代码的时候，可以省略 {}
  - 只要一行代码的时候，表达式的返回值作为箭头函数的默认返回值，可以省略return
  - 如果箭头函数默认返回对象，省略{ }的时候必须加上（{ }）

### **2.2箭头函数中的this**绑定

- 箭头函数是没有this的绑定的
- this查找规则
  - 去上层的作用域中查找this
  - 找到找到全局this
- 箭头函数是没有原型的 函数本身没有this
- this指向定义的时候来自外层的第一个普通函数的this ，和使用的位置那没关系
- 被继承的普通函数的this改变指向，箭头函数的this指向也会改变
- 不能直接修改箭头函数的this指向
  可以间接的改变指向，去修改被继承的普通函数的this指向，箭头函数的this指向也会跟着变
- 如果箭头函数外层没有普通函数，严格模式和非严格模式下this都会指向window

### 2.3箭头函数的argument和rest

- 箭头函数的this指向全局，使用argument会报错 
  指向window的时候会报错。未声明argument
  ps：如果声明了全局变量argument，就不会报错，但是不是多此一举吗？
- 当箭头函数的this指向普通函数的，argument继承自普通函数
- rest获取函数的多余参数rest
- 优点
  - 箭头函数和普通函数都可以使用
  - 更加灵活，接收参数的数量完全自定义
  - 可读性好
  - rest是真正的数组，可以使用 数组的API
- 使用的注意事项
  - rest必须是函数的最后一次参数
  - 函数的length属性，不包括rest参数 rest可以用于数组



### **2.4注意事项**

- 使用new进行箭头函数，会报错，因为箭头函数没有constructor
- 箭头函数不支持new.target ES6新特性，普通函数使用会返回该函数的引用 作用：确定构造函数是否是new调用的
- 箭头函数this指向全局对象，在函数中使用箭头函数会报错
- 箭头函数的this指向普通函数，new.target指向该函数的普通引用
- 箭头函数不支持重命名函数，普通函数支持重命名函数
- 一条语句返回对象字面量，需要加小括号或者直接写成多条语句的return形式
- 箭头函数的解析顺序相对靠前

### 2.5不适用的场景

- 定义字面量，this的意外指向

- 回调函数的动态this 

  ```js
  const button = document.getElementById('myButton');
  button.addEventListener('click', () => {
      this.innerHTML = 'Clicked button'; // this又指向了全局
  });
  ```

  

- 函数内部有大量操作的时候建议使用普通函数

