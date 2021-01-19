  // 需要在worker中执行的脚本
  const workerScript = () => {
          onmessage = (msg) => {
              // 发送网络请求
              const response = await fetch(msg.data, {
                  method: "post",
                  body: `yes = 1`,
              }).then((res) => res.json);

              if (response) {
                  // TODO 可以在这里对数据进行处理，然后发送给主线程
                  postMessage(`我数据处理完成了，给你用吧`);
              }
          };
      }
      // 将上述执行脚本转换为字符串
  let code = workerScript.toString();
  // 对字符串进行分割，取到onmessage部分的函数声明
  code = code.substring(code.indexOf("{") + 1, code.lastIndexOf("}"));
  // 将字符串转换为Blob URL
  const blob = new Blob([code], { type: "application/javascript" });
  const blobUrl = URL.createObjectURL(blob);
  // 导出生成的Blob URL
  export default blobUrl;