function createObject(o){
    function F(){}
    F.prototype = o
    return new F()
}
//子类和父类函数
function inherit(Subtype,Supertype){

    //方法1；
    Subtype.prototype = createObject(Supertype.prototype) //只影响子类的实例、
    //设置子类实例的原型链 继承父类的实例和方法
    Object.defineProperty(Subtype.prototype,"constructor",{
        enumerable : false,
        configurable : true,
        writable : true,
        value : Subtype
    })
    Object.setPrototypeOf(Subtype,Supertype)//让子类动态继承父类的静态属性和方法
    //设置子类本身的原型链，继承父类的属性和方法
    //一个实例，一个本身


    //方法2；
    // Subtype.prototype.__proto__ = Supertype.prototype


    //方法3：
    // Object.setPrototypeOf(Subtype.prototype,Supertype.prototype)
}