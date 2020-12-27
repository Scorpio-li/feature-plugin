import KoaRouter from 'koa-router'
import proxy from '../middleware/Proxy'
import { delay } from '../lib/util'
let Mock = require('mockjs')
let Random = Mock.Random

const router = new KoaRouter()
router.get('/your-mock-api', (ctx) => {
    ctx.body = '你的第一个mock接口'
})
module.exports = router