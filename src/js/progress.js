((root) => {
    class Progress {
        constructor() {
            this.durationTime = 0; //总时长
            this.pre = null;
            this.startTime = 0;
            this.farmId = null; //这是定时器
            this.lastPercent = 0;
            this.init();
        }

        init() {
            this.getDom();
        }
        //获取dom元素
        getDom() {
            this.prevTime = document.querySelector(".prevTime");
            this.circle = document.querySelector(".circle");
            this.frontBg = document.querySelector(".frontBg");
            this.totalTime = document.querySelector(".totalTime");
        }

        //渲染总时长
        renderAllTime(time) {
            this.durationTime = time; //记录时长

            time = this.transferTime(time);

            this.totalTime.innerHTML = time;
        }
        //将秒速的时长转换成分钟制
        transferTime(time) {
            time = Math.round(time);
            let m = Math.floor(time / 60); //取最大倍数
            let s = time % 60; //取余

            m = m < 10 ? "0" + m : m;
            s = s < 10 ? "0" + s : s;

            return m + ":" + s;
        }

        //移动进度条
        move(per) {
            let _this = this;

            this.startTime = new Date().getTime(); //记录起始播放时间点

            _this.lastPercent = per === undefined ? this.lastPercent : per;

            function frame() {
                let curTime = new Date().getTime(); //记录当前时间点
                let per =
                    _this.lastPercent +
                    (curTime - _this.startTime) / (_this.durationTime * 1000);

                if (per <= 1) {
                    //代表还没播出完
                    _this.update(per);
                } else {
                    //代表播出完毕,关闭定时器
                    cancelAnimationFrame(_this.farmId);
                }

                //这是一个html5的关键帧动画函数
                _this.farmId = requestAnimationFrame(frame);
            }
            frame();
        }
        //更新进度条
        update(per) {
            //更新时间
            let time = this.transferTime(per * this.durationTime);
            this.prevTime.innerHTML = time;

            //小圆点
            let l = this.circle.parentNode.offsetWidth;
            this.circle.style.transform = `translateX(${per * l}px)`;

            //进度条更新
            this.frontBg.style.width = per * 100 + "%";
        }
        stop() {
            cancelAnimationFrame(this.farmId);

            let stopTime = new Date().getTime();

            this.lastPercent +=
                (stopTime - this.startTime) / (this.durationTime * 1000);
        }
    }

    function instantiation() {
        return new Progress();
    }

    //拖拽实例
    class Drag {
        constructor(dom) {
            this.dom = dom;
            this.startPointX = 0; //开始按下的位置
            this.goDis = 0; //按下时走的距离
            this.percent = 0; //拖拽的百分比
        }
        init() {
            let _this = this;
            this.dom.style.transform = "translateX(0px)"; //让元素一开始就有一个transform值，方便一会获取

            //开始拖拽
            this.dom.addEventListener("touchstart", (e) => {
                _this.startPointX = e.changedTouches[0].pageX; //记录起点位置。

                //获取元素上的transform值，并且接续上次的值继续运动。
                _this.goDis = parseFloat(
                    _this.dom.style.transform.split("(")[1]
                );

                //可以在主控模块中赋予这个方法。
                _this.start && _this.start();
            });

            //拖拽移动
            this.dom.addEventListener("touchmove", (e) => {
                _this.disX = e.changedTouches[0].pageX - _this.startPointX; //拖动的距离

                let l = _this.goDis + _this.disX; //小圆点需要走的距离

                let parentWidth = _this.dom.offsetParent.offsetWidth;

                l = l < 0 ? 0 : l > parentWidth ? parentWidth : l;

                _this.dom.style.transform = `translate(${l}px)`;

                //计算走的百分比
                _this.percent = l / parentWidth;

                //将百分比传递出去,一会可以让进度条等同步运动
                _this.move && _this.move(_this.percent);

                e.preventDefault();
            });

            //弹起拖拽
            this.dom.addEventListener("touchend", (e) => {
                _this.end && _this.end(_this.percent);
            });
        }
    }

    function instantiationDrag(dom) {
        return new Drag(dom);
    }

    root.progress = {
        pro: instantiation,
        drag: instantiationDrag,
    };
})(window.player || (window.player = {}));
