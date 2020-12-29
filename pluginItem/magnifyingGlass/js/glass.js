(function($) {
    $.fn.glass = function() {
        var mask = $('#mask');
        var box = $('#box');
        var look = $('#look');
        var move = $('#move');
        var btn = $('#btn');
        var imgMaxMove;
        var maskMaxMove;
        var _this = $(this);

        //点击按钮
        btn.on('click', function() {
            move.html('');
            takeScreenshot();
            _this.css('display', 'block');
        });

        //点击屏幕的时候就消除
        _this.on('click', function() {
            _this.css('display', 'none');
        })


        //获取屏幕截图
        function takeScreenshot() {
            alert('1');
            html2canvas($('#bd'), {
                allowTaint: true,
                taintTest: false,
                onrendered: function(canvas) {
                    canvas.id = 'cv';
                    var dataUrl = canvas.toDataURL();
                    var newImg = document.createElement("img");
                    newImg.src = dataUrl;
                    newImg.width = 4 * $('#bd').width();
                    newImg.height = 4 * $('#bd').height();
                    move.width(newImg.width);
                    move.height(newImg.height);
                    move.append(newImg);


                    _this.on('mousemove', function(e) {
                        var left = e.clientX - mask.width() / 2; //横坐标
                        var top = e.clientY - mask.height() / 2; //纵坐标
                        //console.log(mask.width());
                        //设置遮挡层的left和top
                        var x = left; //margin
                        var y = top; //margin
                        x = x < 0 ? 0 : x; //如果横坐标小于0就设置为0
                        y = y < 0 ? 0 : y; //如果纵坐标小于0就设置为0
                        x = x > box.width() - mask.width() ? box.width() - mask.width() : x;
                        y = y > box.height() - mask.height() ? box.height() - mask.height() : y;
                        mask.offset({ "left": x, "top": y });


                        //大图的最大的移动距离
                        imgMaxMove = newImg.width - look.width();
                        console.log(imgMaxMove);
                        //遮挡层的最大的移动距离
                        maskMaxMove = box.width() - mask.width();
                        console.log(maskMaxMove);

                        //大图的横向移动的距离
                        var imgMoveLeft = x * maskMaxMove / imgMaxMove * 9;
                        //大图的纵向移动的距离
                        var imgMoveTop = y * maskMaxMove / imgMaxMove * 9;
                        move.css("marginLeft", -imgMoveLeft);
                        move.css("marginTop", -imgMoveTop);
                    })
                },
            });
        }
    }
})(jQuery);