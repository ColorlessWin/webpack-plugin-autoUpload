const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')
const utils = require('./utils')
const config = require('./config')
const request_ip = require('request-ip').getClientIp

var app = express()
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));

let webappPath = config.STATIC_PATH.replace(/\\/, '/')
// app.use(express.static(webappPath))

function verify(func) {
  let timestamp_map = new Map()
  return (req, res) => {
    if (Date.now() - (timestamp_map.get(request_ip(req)) || 0) < config.RETRY_TIME) {
      res.status(403); res.end();
      return
    } 
    // 验证密码 
    if (req.body.key !== config.HOT_UPDATE_KEY) {  
      timestamp_map.set(request_ip(req), Date.now())
      res.status(401); res.end();
      return
    }
    func(req, res)
  }
}


app.post('/api/before-update', verify((req, res) => {  
  fs.promises.rmdir(webappPath, { maxRetries: 3, recursive: true, retryDelay: 20 })
    .then(() => { res.status(200); res.end()})
    .catch(err => { 
      console.error(err)
      res.status(500)
      res.end()
    })
}))


app.post('/api/hot-update', verify((req, res) => {
  let buf = Buffer.from(req.body.file.data)
  let filePath = path.resolve(webappPath, req.body.filename)

  utils.createDirs(filePath)
  fs.writeFile(filePath, buf, function(err) {
    if (err) {
      res.status(500)
    }else {
      console.log('\x1B[32m%s\x1B[39m', `文件更新成功：${filePath}`)
      res.status(200)
    }
    res.end()
  })
}))

app.listen(config.HOT_UPDATE_PORT)