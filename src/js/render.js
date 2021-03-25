(function (root) {
    //渲染图片
    function renderImg(src) {
		root.blurImg(src);	//给body添加背景图片
		

		var img = document.querySelector('.img img');
		img.src = src;
    }
    //渲染歌曲信息
    function renderMessage(data) {
        const message = document.querySelector(".message").children;
        message[0].innerHTML = data.name;
        message[1].innerHTML = data.singer;
        message[2].innerHTML = data.album;
    }
    //渲染是否喜欢
    function renderIsLike(isLike) {
        const lis = document.querySelectorAll(".control li");
        lis[0].className = isLike ? "liking" : "";
    }

    root.render = function (data) {
        renderImg(data.image);
        renderMessage(data);
        renderIsLike(data.isLike);
    };
})(window.player || (window.player = {}));
