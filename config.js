const path = require('path')

module.exports = {
  // 密码
  HOT_UPDATE_KEY: 'freeyihunyu',
  // 端口
  HOT_UPDATE_PORT: 81,
  // 静态资源存放路径
  STATIC_PATH: path.resolve(__dirname, './static'),
  // 当密码验证失败之后，需要等多少时间之后才能再次访问
  RETRY_TIME:  1000 * 30
}