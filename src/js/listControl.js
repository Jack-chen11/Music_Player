((root) => {
    function listControl(data, wrap) {
        let list = document.createElement("div"),
            dl = document.createElement("dl"),
            dt = document.createElement("dt"),
            close = document.createElement("div"),
            musicList = []; //用于存储存放歌曲的dom对象

        list.className = "list";
        dt.innerHTML = "播放记录";
        dl.appendChild(dt);
        close.className = "close";
        close.innerHTML = "关闭";

        data.forEach((item, index) => {
            var dd = document.createElement("dd");
            dd.innerHTML = item.name;

            dd.addEventListener("touchend", () => {
                changeActive(index);
                slidDown();
            });

            dl.appendChild(dd);
            musicList.push(dd);
        });

        list.appendChild(dl);
        list.appendChild(close);
        wrap.appendChild(list);

        let disY = list.offsetHeight;

        list.style.transform = `translateY(${disY}px)`;

        close.addEventListener("touchend", slidDown);

        //显示列表
        function slidUp() {
            list.style.transition = `0.4s`;
            list.style.transform = "";
        }

        //隐藏列表
        function slidDown() {
            list.style.transition = `0.4s`;
            list.style.transform = `translateY(${disY}px)`;
        }

        //点击歌曲切换class
        function changeActive(index) {
            for (let i = 0; i < musicList.length; i++) {
                musicList[i].className = "";
            }
            musicList[index].className = "active";
        }

        //默认显示第一个
        changeActive(0);

        return {
            musicList: musicList,
            slidUp: slidUp,
            slidDown: slidDown,
            changeActive: changeActive,
        };
    }

    root.listControl = listControl;
})(window.player || (window.player = {}));
