const http = require("http");
const fs = require("fs");

// 创建服务
const server = http.createServer((req, res) => {
    // 下载接口  
    if (req.url === "/download") {
        res.writeHead(200, {
            "Content-type": "application/vnd.ms-excel", // 返回excel文件            
            // 跨域设置      
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "content-type"
        })

        // 异步读取文件内容    
        fs.readFile("test.xlsx", (err, data) => {
            // 返回二进制流文件        
            res.end(data)
        })
    }
})

// 服务启动在3000端口
server.listen(3000)
console.log("server run at 3000")