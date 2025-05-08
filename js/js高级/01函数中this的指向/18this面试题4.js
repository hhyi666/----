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
