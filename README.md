# node-tongji

This is a module for Baidu Tongji Api of Node.js 7.6+

百度统计Api的Node.js模块，调用它来做其他的定时任务、统计数据同步之类的...

百度官方就特么给了个PHP的例子，所以花了点时间写了个js版本供大家使用和参考

喜欢的话就给个星星吧，蟹蟹各位大佬

## Installation 安装方式

```
$ npm install node-tongji --save
```


## Config 配置

配置项`config`中需要包含以下基础字段

| Name          | Description                       | Type   |
| ------------- |:---------------------------------:| ------:|
| username      | 登录百度统计使用的用户名          | string |
| password      | 登录百度统计使用的密码            | string |
| token         | 在百度统计控制台中申请的token     | string |
| uuid          | 随便起一个乱七八糟的东西就行      | string |

日志的输出等级和输出方式是可以配置的，也是在`config`中增加字段和值

配置`logLevel`可以设定日志输出的等级


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
