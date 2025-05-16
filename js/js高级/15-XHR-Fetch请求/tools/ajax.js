function hyajax({
    url,
    method = "get",
    data = {},
    timeout = 10000,
    header = {}, //传入token
    success,
    failure
} = {}) {
    //1。创建对象
    const xhr = new XMLHttpRequest()
    //2。设置监听
    xhr.onload = function () {
        // console.log(xhr.response)
        if (xhr.status >= 200 && xhr.status < 300) {
            success && success(xhr.response)
        } else {
            failure && failure({ status: xhr.status, message: xhr.statusText })
        }
    }
    //3.设置类型
    xhr.timeout = timeout
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
    return xhr //返回可以手动取消 但是Promise不能进行返回
}