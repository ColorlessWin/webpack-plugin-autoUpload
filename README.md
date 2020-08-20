# webpack-plugin-autoUpload
这个webpack插件可以将build的完成的文件自动上传到服务器，需要和服务端配合使用
## 使用
#### webpack插件：`webpack-plugin/UploadServerPlugin.js`
在webpack中配置
```javascript
const UploadServerPlugin = require('./plugins/UploadServerPlugin')
...
configureWebpack: {

  plugins: [
    /**
      * options{address} 服务器地址
      * options{port} 端口
      * options{password} 密码， 服务器需要验证密码才能执行更新
      * */
    new UploadServerPlugin({
      address:  'http(s)://example.com',
      port:      8080,
      password: 'example.password'
    })
  ],
}
```

#### 服务端
放置于你的服务器上  
配置`config.js`
```javascript
module.exports = {
  // 密码
  HOT_UPDATE_KEY: 'example.password',
  // 端口
  HOT_UPDATE_PORT: 8080,
  // 静态资源存放路径
  STATIC_PATH: path.resolve(__dirname, './static'),
  // 当密码验证失败之后，需要等多少时间之后才能再次访问
  RETRY_TIME:  1000 * 30 //ms
}
```
运行
```
$ npm install
$ node update_services.js
```