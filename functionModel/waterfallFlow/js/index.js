// 第一步：将jquery中的全局变量转化为局部变量。

/*自调用  形成一个闭包 */
(function($) {
    /*如果不加jQuery里面使用的$是全局变量，加了之后使用的就是成员变量*/

})(jQuery);