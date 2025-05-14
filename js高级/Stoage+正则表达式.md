## 一.Stroage

## 1.1基本使用

用来临时存储保存同一窗口或标签的数据，关闭窗口之后数据能够继续保留(local)或者清除（session）

与cookie的区别

- 容量更大
- 不参与http的请求
- API更简单
- 注意：仅仅支持字符串的存储

## 1.2 Session和Local的区别

- 数据的有效性：local 永久存储除非手动删除 session当前对话没删除消失
- 数据共享：同一域名（使用跳转的能够存储）下所有的窗口共享，当前的窗口/标签页可见
- 存储大小：差不多
- 一个长期储存 一个保存临时会话的数据

## 1.3Storage的常见的属性和方法

- length 返回长度
- key 返回keys的值
- getItem 得到对应的保存值
- setItem 存储特定的值
- removeItem 清除值
- clear 全部清除

## 1.4封装cache

```js
class Cache {
    constructor(islocal = true){
        this.storage = islocal ? localStorage : sessionStorage
    }
    setCache(key, value) {

        if (value) this.storage.setItem(key, JSON.stringify(value))
        else {
            throw new Error("error : value")
        }
    }
    getCache(key) {
        const res = this.storage.getItem(key)
        if (res) return JSON.parse(res)
    }
    removeCache(key) {
        this.storage.removeItem(key)
    }
    clear() {
        this.storage.clear()
    }
}

const localCache = new Cache()
const sessionCache = new Cache(false)
```

转化成JSON的好处

- 原生的JSON的仅支持字符串：直接将对象转化成为[object object]对象
- JSON序列化 ：可以存储和读取对象，数组，嵌套结构等复杂的数据
- 便于跨平台的运输
- 代码的可维护性
- 统一性

## 问题

### 如何储存对象到Storage当中

使用JSON.stringfy 将对象进行序列化
读取的时候使用JSON.parse进行反序列化

### Storage的优点

优点：访问时容量大 API简单 支持事件的监听

缺点：仅仅支持字符串，需要手动实现 需要定期进行清理

## 二.正则表达式

2.1认识正则和JS的创建

正则是用来匹配字符串模式的工具

```js
        const re1 = new RegExp("abc","ig") //这是匹配的规则
        const re2 = /abc/ig //注释

        console.log(re2)
```



- 字符串匹配的利器

- 创建正则

  - new

    ```
    const res1 = new RegExp("abc","ig")//值和修饰符
    ```

    

  - 字面量 //

    ```js
    cosnt res2 = /abc/ig //使用斜杠进行包裹
    ```

  - 修饰符
    ![image-20250514190348245](C:\Users\Lenovo\AppData\Roaming\Typora\typora-user-images\image-20250514190348245.png)

2.2常见的方法

- 正则的方法
  - exec
    使用正则执行一个字符串
    执行并找到最近的结果
    返回匹配结果的数组
  - test
    返回bool值，表示是否匹配  一般就是调用的时匹配的（短的）去匹配长的
- 字符串的方法
  - match 返回匹配的结果的数组
  - matchAll 返回所有匹配结果的迭代器
  - search 返回第一个进行匹配的索引 否则返回-1
  - split 根据正则进行字符串的分割
  - replace  替换匹配的字符串

2.3正则的规则

- 元字符

  ![image-20250514190752615](C:\Users\Lenovo\AppData\Roaming\Typora\typora-user-images\image-20250514190752615.png)

- 量词![image-20250514190839742](C:\Users\Lenovo\AppData\Roaming\Typora\typora-user-images\image-20250514190839742.png)

- 字符类 使用[]进行包裹 里面能够设置范围，拿到想要的值

- 锚点
  ![image-20250514191039797](C:\Users\Lenovo\AppData\Roaming\Typora\typora-user-images\image-20250514191039797.png)

- 分组：使用（）进行分组，能够将自己本身的字符串放进一个元素，其他被分组的放进其他的元素

- 贪婪和惰性模式

  - 贪婪：会将找到匹配的最后一个进行匹配，中间符合的全部当作没有的成分

  - 惰性：会找到最前面的符合的字符 进行返回

  - 贪婪模式的后字符串加上？就能转化成为惰性模式

    ```js
    const nameRe = /《.+》/ig
    const nameRee = /《.+?》/ig 
    ```

- 简单的匹配比使用正则的匹配更简单，更快，优先考虑

2.4联系案例

- 歌词的解析

  ```js
          //正常的情况下这个数据是通过网路请求拿到的 拿到后端服务器的数据
  
          const lyricLineStrings = [
              { time: 3, text: "在每个眼神都只身荒野那瞬间" },
              { time: 10, text: "你和我面对面如此地安慰" },
              { time: 18, text: "如果我能发现" },
              { time: 22, text: "动情的灵魂终将在前夜告别" },
              { time: 26, text: "我也不愿停下仅有时间" },
              { time: 29, text: "让我忘了我是谁" },
          ]
  
          //针对某一行的进行解释
          const formattedStrings = lyricLineStrings.map(item =>
              `${item.time}${item.text}`
          ) //使用map直接进行拼接 
          // console.log(formattedStrings)
          
          //这个方法能够够直接封装后续直接使用这个方法 
          //更加方便
          //想不到是正常的
  
          //匹配时间
          const timeRe = /\d\d?/ //观察拆开的部分
          //当这里是时分秒的时候使用正则拆开
          //字符串转化的时候会进行隐式转化
          const lyricInfos = []
          for (const linestring of formattedStrings) {
              //1.获取时间
              // console.log("time:",linestring.match(timeRe)[0]) //直接拿到时间
              const time = linestring.match(timeRe)[0]
              //2.获取内容
              const content = linestring.replace(timeRe,"").trim() //去空格
              console.log(time,content)
              const lyricInfo = {time,content}
              lyricInfos.push(lyricInfo)
          }
          console.log(lyricInfos) 
          //后面显示歌词后面学 使用正则歌词
  ```

  

- 时间格式化
  直接匹配到相应的位置进行替换
  注意检查对应的位置是否有能够替换的

  ```js
          //传进来的时间可能会有不同
  
  
          function formateTime(timestamp,fmtstring){
              const date = new Date(timestamp)
              console.log(date)
              const dateO = { //这里是为了使用for循环进行匹配找到值
                  "y+" : date.getFullYear(),
                  "M+" : date.getMonth() + 1,
                  "d+" : date.getDate(),
                  "h+" : date.getHours(),
                  "m+" : date.getMinutes(),
                  "s+" : date.getSeconds(),
              }
  
              for (const key in dateO) {
                  const keyRe = new RegExp(key) //key的正则表达式
                  // console.log(keyRe) 
  
                  //有这个的位置，就能够进行替换 找到相对应的位置
                  if(keyRe.test(fmtstring)){ //判断有没有 这个数据的位置
                      const value = (dateO[key] + "").padStart(2,"0")//需要转换成字符串的形式进行操作
                      fmtstring = fmtstring.replace(keyRe,value) //replace能够查找正则表达式
                      //对相应的位置进行替换 对正则表达式的位置进行替换
                  }
              }
  
              return fmtstring
          }
  
          const timeEl = document.querySelector(".time")
          //拿到时间 上架的时间 结束的时间
          //拿到的是时间戳 是一段数字怎么处理 
          const produceJSON = {
              name : "phone",
              newPrice : 9000,
              oldPrice : 5000,
              endTIme : 1659252290637
          }
          timeEl.textContent = formateTime(produceJSON.endTIme,"yyyy/MM/dd hh:mm:ss")
          //这里的位置可是式任意的
  ```

  