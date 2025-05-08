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