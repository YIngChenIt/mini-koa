const http = require('http')
const context = require('./context')
const request = require('./request')
const response = require('./response')
const EventEmitter = require('events')
module.exports = class extends EventEmitter {
    constructor() {
        super()
        this.fn
        this.context = Object.create(context)
        this.request = Object.create(request)
        this.response = Object.create(response)
        this.middlewares = [] // 新
    }
    listen() {
        let server = http.createServer(this.callbacks.bind(this))
        server.listen(...arguments)
    }
    use(middleware) {
        this.middlewares.push(middleware) // 新增
    }
    compose(ctx) {
        let index = 0
        let i = -1 //新
        const dispatch = () => {
            if(index <= i ) return Promise.reject('multiple call next()') // 新
            i = index// 为了防止多次调用 多次调用index值不会发生变化，但是i第一次已经和index相等了，所以第二次在调用 i 和 index相等 就抛出错误
            if(index === this.middlewares.length) return Promise.resolve()
            let middleware  = this.middlewares[index++]
            return Promise.resolve(middleware(ctx, () => dispatch()))
        }
        return dispatch()
    }
    callbacks(req, res) {
        let ctx = this.createContext(req, res)
        this.compose(ctx).then(() => {

        }).catch(err => {
            this.emit('error', err)
        })
    }
    createContext(req, res) {
        let ctx = this.context
        ctx.request = this.request
        ctx.response = this.response
        ctx.request.req = ctx.req = req
        ctx.response.res = ctx.res = res
        return ctx
    }
}