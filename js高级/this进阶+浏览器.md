# **内容回顾**

## 一.this面试题

- 四种绑定规则
- 箭头函数不能绑定this

```js
var name = "window"

var person = {
    name : "person",
    sayName : function(){
        console.log(this.name);
    }
};

function sayName(){
    var sss = person.sayName;
    sss();//默认绑定 window全局的

    person.sayName();//隐式绑定 preson

    (person.sayName)();//隐式绑定 person

    (b = person.sayName)();//间接函数引用，全局window
}

sayName();
```

```js
var name = "window"

var person1 = {
    name : "person1",
    foo1 : function(){
        console.log(this.name)
    },
    foo2 : () => console.log(this.name),
    foo3 : function(){
        return function(){
            console.log(this.name)
        }
    },
    foo4 : function(){
        return () => {
            console.log(this.name)
        }
    }
};
//加不加括号就是代表运行不运行
var person2 = {name : "person2"}
person1.foo1();//隐式绑定 ： person1
person1.foo1.call(person2);//显示绑定 preson2

person1.foo2();//箭头函数去上层作用域找到window
person1.foo2.call(person2)//上层作用域window

person1.foo3()();//默认绑定window
//foo3没有运行，还是默认绑定
person1.foo3.call(person2)();//默认绑定window
person1.foo3().call(person2);//显式绑定person2

person1.foo4()();//去上一层作用域找到this绑定的值 隐式绑定preson1
person1.foo4.call(person2)();//显式绑定person2
person1.foo4().call(person2);//先隐式绑定到person1 后面的箭头函数向上找到person1 返回person1
//！！！找到最先开始的绑定的是谁的值

```

```js
var name = "window"

//创建一个空对象
//对象复制给this
//执行函数体中的函数

function Person (name) {
    this.name = name
    this.foo1 = function(){
        console.log(this.name)
    }
    this.foo2 = () => {
        console.log(this.name)
    }
    this.foo3 = function(){
        console.log(this.name)
    }
    this.foo4 = function(){
        return () => {
            console.log(this.name)
        }
    }
};

var person1 = new Person("person1")
var person2 = new Person("person2")

person1.foo1()//隐式绑定 person1
person1.foo1.call(person2)//显式绑定 person2

person1.foo2()//上层作用域 person1
person1.foo2.call(person2)//上层作用域 person1

person1.foo3()()//默认绑定直接返回window
person1.foo3.call(person2)()//默认绑定指向window
person1.foo3().call(person2)//显式绑定 person2

person1.foo4()()//上层作用域找 person1
person1.foo4.call(person2)()//显式绑定 person2
person1.foo4().call(person2)//上层作用域 隐式绑定 person1

```

```js
var name = "window"

//创建一个空对象
//对象复制给this
//执行函数体中的函数

function Person(name) {
    this.name = name
    this.obj = {
        name: "obj",
        foo1: function () {
            return function () {
                console.log(this.name)
            }
        },
        foo2: function () {
            return () => {
                console.log(this.name)
            }
        }
    }
};

var person1 = new Person("person1")
var person2 = new Person("person2")

//就是函数对象之间来回传递
person1.obj.foo1()()//默认绑定 window
person1.obj.foo1.call(person2)()//默认绑定 window
person.obj.foo1().call(person2)//显式绑定，person2

person1.obj.foo2()()//上层作用域 直接就是obj
person1.obj.foo2.call(person2)()//上层作用域找到 person2
person1.obj.foo2().call(person2)//上层作用域 obj

```

## 二.浏览器运行原理

### **3.1输入URL网页请求显式的过程**



### **3.2网页的渲染过程**

- HTML解析 -> DOM tree
- CSS解析 > CSSOM tree
- 生成 Render tree
- 进行 layout布局
- 进行paint绘制

### **3.3回流和重绘**	

- 需要重新布局
  - DOM结构发生改变
  - 改变了布局
  - 窗口的改变
  - 使用getComtentStyle获取尺寸位置信息
  - .......

- 重绘
  - 颜色样式的改变

- 回流一定会引起重绘，尽量避免回流
  - 一次性修改样式
  - 减少DOM操作
  - 尽量不用getComputerstyle
  - 可以使用绝对定位

### **3.4合成Composite**

- 默认的文档流中的内容最终会放到一个合成图层当中
- 某些特殊的CSS属性，会生成新的合成图层
  - position：fixed
  - transform 3D
  - will-change
  - opcaity执行时的动画
  - animation/trantision执行transform

### **3.5defer和async**

- script会阻塞DOM tree的构建，需要先下载执行
- defer
  - 不会阻塞DOM tree构建
  - DOM tree构建完成，再DOMContentLoaded事件之前
  - 能够保证多个defer的script的顺序
  - 从性能角度最好放在head当中
  - defer对于script元素没有外部引用无效
- async
  - 独立下载/运行

## 三.JS运行原理

   

### 4.1V8引擎执行代码的流程

![image-20250507084929683](C:\Users\Lenovo\AppData\Roaming\Typora\typora-user-images\image-20250507084929683.png)



### 4.2V8引擎其他内容的补充

- 核心的3个模块
- 词法分析/语法分析

- 4.3ECMA文档版本问题

