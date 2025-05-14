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