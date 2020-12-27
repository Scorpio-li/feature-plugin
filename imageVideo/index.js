var urlRoot = './thumbs/cs-img';
var indexRange = [1, 21];
var maxLength = indexRange[1] - indexRange[0] + 1;
// loading
var eleContainer = document.getElementById('container');
var eleLoading = document.getElementById('loading');
// 存储预加载的DOM对象和长度信息
var store = {
    length: 0
};
// 图片序列预加载
for (var start = indexRange[0]; start <= indexRange[1]; start++) {
    (function(index) {
        var img = new Image();
        img.onload = function() {
            store.length++;
            // 存储预加载的图片对象
            store[index] = this;
            play();
        };
        img.onerror = function() {
            store.length++;
            play();
        };
        img.src = urlRoot + index + '.jpg';
    })(start);
}

var play = function() {
    // loading进度
    var percent = Math.round(100 * store.length / maxLength);
    eleLoading.setAttribute('data-percent', percent);
    eleLoading.style.backgroundSize = percent + '% 100%';
    // 全部加载完毕，无论成功还是失败
    if (percent == 100) {
        var index = indexRange[0];
        eleContainer.innerHTML = '';
        // 依次append图片对象
        var step = function() {
            if (store[index - 1]) {
                eleContainer.removeChild(store[index - 1]);
            }
            eleContainer.appendChild(store[index]);
            // 序列增加
            index++;
            // 如果超过最大限制
            if (index <= indexRange[1]) {
                setTimeout(step, 42);
            } else {
                // 本段播放结束回调
                // 我这里就放一个重新播放的按钮
                eleContainer.insertAdjacentHTML('beforeEnd', '<button onclick="play()">再看一遍英姿</button>');
            }
        };
        // 等100%动画结束后执行播放
        setTimeout(step, 100);
    }
};