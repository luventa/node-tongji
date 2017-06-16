# node-tongji

This is a module for Baidu Tongji Api of Node.js 7.6+

百度统计Api的Node.js模块，调用它来做其他的定时任务、统计数据同步之类的...

百度官方就特么给了个PHP的例子，所以花了点时间写了个js版本供大家使用和参考

喜欢的话就给个星星吧，蟹蟹各位大佬

**注意！这个是统计Api的模块，用于导出百度统计中的数据，不是埋点用的**

什么是[百度TongjiApi](http://tongji.baidu.com/open/api/more?p=tongjiapi_guide.tpl)

## Installation 安装方式

```
$ npm install node-tongji --save
```


## Config 配置

百度Tongji Api需要登录后才可以获取统计数据，因此，需要配置`config`来获取统计模块对象

### Basic 基础字段

配置项`config`中需要包含以下基础字段

| Name          | Description                       | Type   |
| ------------- |:---------------------------------:| ------:|
| username      | 登录百度统计使用的用户名          | string |
| password      | 登录百度统计使用的密码            | string |
| token         | 在百度统计控制台中申请的token     | string |
| uuid          | 随便起一个乱七八糟的东西就行      | string |



### Optional 可选字段

* `logLevel`:

日志输出等级, `sting`类型, 默认值为 `info`

可选值为 `log`, `debug`, `info`, `warn`, `error` 和 `fatal`

* `logProvider`

日志的打印方式, `function`类型, 默认使用`console`进行输出

使用log4js示例如下

``` js
config.logProvider = () => {
  const logger = require('log4js').getLogger('TAM')
  logger.log = logger.trace
  return logger
}
```

_未必好用，我自己没怎么测试这块哈哈哈_


## Examples 示例

```js
const config = {
  username: 'YOURUSERNAME', //你登录百度统计时候用的账号
  password: 'YOURPASSWORD', //你的密码，放心我不会盗号
  token: 'YOURTOKEN', //你的token，在百度统计你的控制台页面里能找到
  uuid: 'this-is-a-fucking-uuid' //随便起个就行了
}

const tongji = require('node-tongji').getInstance(config)

const test = async () => {
  await tongji.login() //首先要登录

  const siteList = await tongji.getSiteList() //登录完之后可以拿到site list

  const siteid = siteList[0].site_id
  console.log(siteList)

  //这个param就自己随便写吧，看看百度统计F12就知道了。
  const data = await tongji.getData({
    site_id: siteid,
    method: 'custom/event_track/a',
    start_date: '2017-06-01',
    end_date: '2017-06-15',
    metrics: 'event_count,uniq_event_count',
    max_results: 20,
    order: 'event_count,desc'
  })
  console.log(data)

  //记得登出
  tongji.logout()
}

test()
```

## Badges

![](https://img.shields.io/badge/license-MIT-blue.svg)
![](https://img.shields.io/badge/status-stable-green.svg)

---
