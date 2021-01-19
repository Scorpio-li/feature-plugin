//   这个文件里需要再次强调一下，我们在创建Worker的时候只能去执行网络资源，不能加载本地资源，所以当我们单纯的导出这个js文件的时候会报类似资源加载失败的错误。

// 需要在worker中执行的脚本
const workerScript = () => {
    onmessage = (msg) => {
        if (msg.data) {
            // 接收到主线程的消息之后，与主线程进行通信
            postMessage(`我接受到你的参数了，我再吐给你${msg.data}`);
        }
    };
};

// 将上述执行脚本转换为字符串
let code = workerScript.toString();
// 对字符串进行分割，取到onmessage部分的函数声明
code = code.substring(code.indexOf("{") + 1, code.lastIndexOf("}"));
// 将字符串转换为Blob URL
const blob = new Blob([code], { type: "application/javascript" });
const blobUrl = URL.createObjectURL(blob);
// 导出生成的Blob URL
export default blobUrl;