// 编写方法转换中文内容，接收参数判断当前数据的Unicode
function utf16to8(str) {
    var out, i, len, c;
    out = ""; //创建空变量保存结果
    len = str.length; //设置传入形参数据长度
    for (i = 0; i < len; i++) {
        c = str.charCodeAt(i); //返回字符串第一个字符的 Unicode 编码: 
        if ((c >= 0x0001) && (c <= 0x007F)) { //判断Unicode 编码范围
            out += str.charAt(i);
        } else if (c > 0x07FF) {
            //将 Unicode 编码转为一个字符
            out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
            out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
        } else {
            //将 Unicode 编码转为一个字符
            out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
        }
    }
    //返回出结果
    return out;
}