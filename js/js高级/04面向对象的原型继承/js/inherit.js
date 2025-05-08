function createObject(o){
    function F(){}
    F.prototype = o
    return new F()
}
//子类和父类函数
function inherit(Subtype,Supertype){

    //方法1；
    Subtype.prototype = createObject(Supertype.prototype)
    Object.defineProperty(Subtype.prototype,"constructor",{
        enumerable : false,
        configurable : true,
        writable : true,
        value : Subtype
    })
    
    //方法2；
    Subtype.prototype.__proto__ = Supertype.prototype


    //方法3：
    Object.setPrototypeOf(Subtype.prototype,Supertype.prototype)
}