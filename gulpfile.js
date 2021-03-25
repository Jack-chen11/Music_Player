const { series, src, dest, parallel, watch } = require("gulp");

//html插件
const htmlClean = require("gulp-htmlclean");

//css插件
const less = require("gulp-less");
const cssClean = require("gulp-clean-css");

//js插件
const stripDebug = require("gulp-strip-debug");
const uglify = require("gulp-uglify");

//image插件
const imgMin = require("gulp-imagemin");

//服务器插件
const connect = require("gulp-connect");

//保存跟目录地址，方便后续维护
const folder = {
    src: "src/",
    dist: "dist/",
};

//html处理,流处理过程 链接文件地址->压缩文件->输出文件->监控文件，进行热更新;
function html() {
    //匹配src目录下html文件下的所有文件
    return (
        src(folder.src + "html/*")
            //使用html插件进行压缩
            .pipe(htmlClean())
            //自带插件输出
            .pipe(dest(folder.dist + "html/"))
            //服务器热更新，需配合watch使用
            .pipe(connect.reload())
    );
}

//css处理,流处理过程 链接文件地址->将less文件转换为css文件->压缩文件->输出文件->监控文件，进行热更新;
function css() {
    //匹配src目录css文件下的所有文件
    return (
        src(folder.src + "css/*")
            //将less文件转换为css文件
            .pipe(less())
            //使用css插件进行压缩
            .pipe(cssClean())
            //自带插件输出
            .pipe(dest(folder.dist + "css/"))
            //服务器热更新，需配合watch使用
            .pipe(connect.reload())
    );
}

//js,流处理过程 链接文件地址->删除调试代码->压缩文件->输出文件->监控文件，进行热更新;
function js() {
    //匹配src目录下js文件下的所有文件
    return (
        src(folder.src + "js/*")
            //删除开发中的调试代码
            .pipe(stripDebug())
            //使用js插件进行压缩
            .pipe(uglify())
            //自带插件输出
            .pipe(dest(folder.dist + "js/"))
            //服务器热更新，需配合watch使用
            .pipe(connect.reload())
    );
}

//image处理,流处理过程 链接文件地址->压缩文件->输出文件;
function image() {
    //匹配src目录下images文件下的所有文件
    return (
        src(folder.src + "images/*")
            //使用image插件进行压缩
            .pipe(imgMin())
            //自带插件输出
            .pipe(dest(folder.dist + "images/"))
    );
}

//开发服务器设置
function server(cb) {
    connect.server({
        port: "8800",
        livereload: true, //开启热更新
        root: "dist",
    });
    cb();
}

watch(folder.src + "html/*", function (cb) {
    html();
    cb();
});
watch(folder.src + "css/*", function (cb) {
    css();
    cb();
});
watch(folder.src + "js/*", function (cb) {
    js();
    cb();
});

//series是gulp自带的方法，可以将里面传递的参数依次执行.
//parallel也是gulp自带的方法，他是将传递的参数，同时执行。
exports.default = series(html, css, js, image, server);
