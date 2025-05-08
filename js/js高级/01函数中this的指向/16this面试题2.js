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
