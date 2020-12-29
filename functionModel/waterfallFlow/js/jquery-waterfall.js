(function($) {
    $.fn.waterfall = function() {
        // this指向的是当前调用这个方法的元素集
        // 当前的瀑布流父容器
        var items = $(this);
        //父容器的宽度
        var wParent = items.width();
        //当前的瀑布流子容器
        var child = items.children();
        //获取子容器的宽度
        var width = child.width();
        //假设排多少列
        var col = 5;
        //计算间距
        var space = (wParent - col * width) / (col - 1);

        //记录每列高度的数组
        var colHeightArr = [];

        //遍历每一个子元素
        $.each(child, function(i, item) {
            var $item = $(item);
            var height = $item.height();

            //定位

            //第一排的元素都是靠顶部的

            //索引从0开始，小于5的时候都是靠顶部的
            if (i < col) {
                $item.css({
                    top: 0,
                    left: i * (width + space)
                });

                //colHeightArr[i] = height;
                colHeightArr.push(height);

                //其他的都要根据最矮的一列进行排列
            } else {
                //找到最矮的那一列进行排列
                //索引
                var index = 0;
                //假设最小的高度是第一个索引对应的高度
                var minHeight = colHeightArr[index];
                //遍历数组，找到最小值和最小值对应的索引
                //k是索引，v是值
                $.each(colHeightArr, function(k, v) {
                    if (minHeight > v) {
                        index = k;
                        minHeight = v;
                    }
                });

                //定位
                $item.css({
                    top: minHeight + space,
                    left: index * (width + space)
                })

                //当前数组中最小的高度进行新的高度的更新
                colHeightArr[index] = minHeight + space + height;
            }
            //console.log(colHeightArr);
        });

        //设置父容器的高度
        var maxHeight = colHeightArr[0];
        $.each(colHeightArr, function(k, v) {
            if (maxHeight < v) {
                maxHeight = v;
            }
        });
        //给父容器设置最高的高度
        items.height(maxHeight);
    }
})(jQuery);