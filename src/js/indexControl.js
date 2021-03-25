((root) => {
    class Index {
        constructor(len) {
            this.index = 0; //默认值
            this.len = len;
        }
        //切换到上一首
        prev() {
            return this.get(-1);
        }

        //切换到下一首
        next() {
            return this.get(1);
        }

        //获取index
        get(val) {
            this.index = (this.index + val + this.len) % this.len;
            return this.index;
        }
    }

    root.indexControl = Index;
})(window.player || (window.player = {}));
