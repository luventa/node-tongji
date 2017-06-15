# node-tongji

This is a module for Baidu Tongji Api of Node.js 7.6+

这特么是个百度统计的Node.js模块，用来写其他的定时同步任务之类的...

因为百度官方就给了个PHP的例子，所以花了点时间写了个js版本的大家可以参考

喜欢的话就给个星吧，蟹蟹各位大佬

## Installation 安装方式

```
$ npm install node-tongji --save
```


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
