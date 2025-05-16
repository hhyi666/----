function hyajax({
    url,
    method = "get",
    data = {},
    header = {}, //传入token
} = {}) {
    //创建对象
    const xhr = new XMLHttpRequest()
    const promise =  new Promise((resolve, reject) => {
        //1。创建对象
        // const xhr = new XMLHttpRequest()
        //2。设置监听
        xhr.onload = function () {
            // console.log(xhr.response)
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr.response)
            } else {
                reject(err)
            }
        }
        //3.设置类型
        xhr.responseType = "json" 
        //4.open 
        if (method.toLocaleUpperCase() === "GET") {
            const queryString = [] //get请求 收到参数
            for (const key in data) {
                queryString.push(`${key}=${data[key]}`) //转换成数组
            }
            url = url + "?" + queryString.join("&")
            // console.log(url)
            xhr.open(method, url)
            xhr.send()
        } else {
            //send /发送的post请求 采用JSON的格式
            xhr.open(method, url)
            xhr.setRequestHeader("Content-type", "application/json")
            xhr.send(JSON.stringify(data))
        }
    })
    promise.xhr = xhr //这里想要传出去就使用对象进行操作 携带着传出去
    return promise

}