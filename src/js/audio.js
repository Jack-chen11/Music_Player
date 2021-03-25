(function (root) {
    class loadMusic {
        constructor() {
            this.audio = new Audio();
            this.status = "pause"; //添加一个播放状态,默认为暂停
        }
        //加载音乐
        load(src) {
            this.audio.src = src; //设置播放路径
            this.audio.load(); //加载音乐
        }
        //播放音乐
        play() {
            this.audio.play(); //直接调用这个方法就可以播放
            this.status = "playing";
        }
        //暂停音乐
        pause() {
            this.audio.pause();
            this.status = "pause";
        }
        //播放完成后事件，例如直接播放下一首还是其他,传递一个回调函数
        end(fn) {
            this.audio.onended = fn;
        }

        //跳转事件播放
        playTo(time) {
            this.audio.currentTime = time; //单位是秒
        }
    }

    root.music = new loadMusic(); //将方法暴露出去
})(window.player || (window.player = {}));
