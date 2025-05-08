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
