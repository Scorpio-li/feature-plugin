# nodemailer

nodemailer是一个发送邮件npm包，我们可以使用它方便快捷的给任何人发送邮件。

## 安装

```shell
mkdir mailBot  #cmd创建文件夹mailBot（touch mailBot  #如果是Linux可以用touch命令）
cd mailBot  #进入文件夹
npm init -y #初始化npm
npm install nodemailer  #安装邮件发送模块
```

qq邮箱的pass（授权码）需要进入 qq邮箱 的【设置】-【账户】，然后如下图1的地方，开启smtp，下图2的地方查看你的授权码

- 开启：IMAP/SMTP服务 (什么是 IMAP，它又是如何设置？)

- 生成授权码：wrxnawehixasijfg

## 自动生成情话

- 彩虹屁网站

- [接口](https://chp.shadiao.app/api.php)

```js
const { default: Axios } = require("axios");
function getHoneyedWords() {
  var url = "https://chp.shadiao.app/api.php";
  //获取这个接口的信息
  return Axios.get(url);
}
```


## 每天定时发送

考虑到每天定时发送会显示的更有诚意，接下来搞个定时发送。我们需要启动个定时任务，使用node-schedule模块。

```js
const schedule = require("node-schedule");
//每天下午5点21分发送
schedule.scheduleJob({ hour: 17, minute: 21 }, function () {
  console.log("启动任务:" + new Date());
  getHoneyedWords().then((res) => {
    console.log(res.data);
    sendMail(res.data);
  });
});
```