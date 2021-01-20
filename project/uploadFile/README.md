
## [通过文件地址直接下载](./nodeUpload/fileAddress)

1. 在空目录test下新建service目录模拟后端，新建index.html文件模拟前端。

2. 安装serve用来启动静态资源服务器

```js
npm install -g serve
```

3. 进入service目录，启动服务

```shell
cd service 
serve -s
```

## [二进制流文件下载](./nodeUpload/binary)

这种情况一般就是实际项目使用的ajax请求接口方式，比如post请求，前端传递若干参数，后端返回文件二进制流。

删除index.html，返回test目录下，使用vue-cli创建一个vue项目。



