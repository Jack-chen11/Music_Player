(function ($, player) {
    class MusicPlayer {
        constructor(dom) {
            this.wrap = dom;
            this.dataList = [];
            // this.now = 0;

            this.indexObj = null;
            this.timer = null;

            //实例化一个进度条组件
            this.progress = player.progress.pro();
        }
        //初始化
        init() {
            this.getDom();
            this.getData("../mock/data.json");
        }

        //获取页面元素
        getDom() {
            this.img = document.querySelector(".img img");
            this.lis = document.querySelectorAll(".control li");
        }

        //获取请求的数据并存储下来
        getData(url) {
            let _this = this;
            $.ajax({
                url: url,
                method: "get",
                success: function (data) {
                    _this.dataList = data; //存储数据

                    _this.listPlay(); //列表切歌需要放在loadMusic前面，因为一会要在loadMusic里面使用这个函数里面的方法。

                    _this.indexObj = new player.indexControl(data.length);

                    _this.loadMusic(_this.indexObj.index); //加载音乐功能

                    _this.musicControl(); //音乐操作功能

                    _this.dragProgress(); //进度条功能
                },
                error() {
                    throw new Error("请求出错了");
                },
            });
        }

        //加载音乐以及渲染信息等
        loadMusic(index) {
            let _this=this;
            player.render(this.dataList[index]);
            //加载音乐播放地址
            player.music.load(this.dataList[index].audioSrc);
            //渲染总时间
            this.progress.renderAllTime(this.dataList[index].duration);
            if (player.music.status == "playing") {
                player.music.play();
                this.lis[2].className = "playing";
                this.imgRotate();

                this.progress.move(0); //强制性让
            }

            //在加载的时候改变list目录的索引值，所以需要将listPlay函数放在load函数上面；
            this.list.changeActive(index);

            //音乐听完，自动下一首
            player.music.end(()=>{
                _this.loadMusic(_this.indexObj.next())
            })
        }

        //旋转图片
        imgRotate(deg = 0) {
            const _this = this;
            clearInterval(this.timer);
            this.timer = setInterval(() => {
                deg = +deg + 0.2;
                _this.img.style.transform = `rotate(${deg}deg)`;
                _this.img.dataset.rotate = deg;
            }, 1000 / 60);
        }

        //停止旋转图片
        imgStop() {
            clearInterval(this.timer);
        }

        //音乐控制
        musicControl() {
            const _this = this;

            //上一首
            this.lis[1].addEventListener("touchend", function () {
                player.music.status = "playing";
                _this.loadMusic(_this.indexObj.prev());
            });

            //播放/暂停
            this.lis[2].addEventListener("touchend", function () {
                if (player.music.status == "playing") {
                    //如果当前状态为播放状态，那么就暂停
                    player.music.pause();
                    this.className = "";
                    _this.imgStop();

                    _this.progress.stop();
                } else {
                    //反之如果当前状态为暂停那么就播放
                    player.music.play();
                    this.className = "playing";
                    let deg = _this.img.dataset.rotate || 0;
                    _this.imgRotate(deg);

                    _this.progress.move();
                }
            });

            //下一首
            this.lis[3].addEventListener("touchend", function () {
                player.music.status = "playing";
                _this.loadMusic(_this.indexObj.next());
            });
        }

        //列表切歌
        listPlay() {
            let _this = this;
            this.list = player.listControl(this.dataList, this.wrap);

            this.lis[4].addEventListener("touchend", () => {
                _this.list.slidUp();
            });

            this.list.musicList.forEach((item, index) => {
                item.addEventListener("touchend", () => {
                    if (_this.indexObj.index == index) {
                        return;
                    }

                    player.music.status = "playing";
                    _this.loadMusic(index);
                    _this.indexObj.index = index;
                    _this.list.slidDown();
                });
            });
        }

        //进度条拖拽功能
        dragProgress() {
            let _this = this;
            player.progress.drag(); //加载拖拽组件

            let circle = player.progress.drag(
                document.querySelector(".circle")
            );
            circle.init();

            //按下圆点
            circle.start = function () {
                _this.progress.stop();
            };

            //拖动圆点
            circle.move = function (per) {
                //拖动小圆点就调用progress.move方法让进度条移动
                _this.progress.update(per);
            };

            //松开小圆点
            circle.end = function (per) {
                //记录拖动到的时间
                let curTime =
                    per * _this.dataList[_this.indexObj.index].duration;

                player.music.playTo(curTime);
                player.music.play();

                //让进度条运动
                _this.progress.move(per);

                //让图片转动
                let deg = _this.img.dataset.rotate || 0;
                _this.imgRotate(deg);

                _this.lis[2].className = "playing";
            };
        }
    }
    let musicPlayer = new MusicPlayer(
        document.getElementsByClassName("wrap")[0]
    );
    musicPlayer.init();
})(window.Zepto, window.player || (window.player = {}));
