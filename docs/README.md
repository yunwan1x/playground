# 常用FAQ

1. [解决chome访问非受信任证书页面，提示您的连接不是私密连接](https://blog.csdn.net/easylife206/article/details/107171565)
2. chrome 常用内部urls [chrome://about](chrome://about)

# 好软推荐

1. [landrop](https://landrop.app/#downloads)，局域网同步神器，支持全客户端。
2. [gpg使用](https://chengpengzhao.com/2020-03-04-ssh-yu-gpg-de-xue-xi-yu-shi-yong/)
3. [ linux apt yum使用](https://www.runoob.com/linux/linux-comm-apt.html)

# IDEA用到的中间件

[中间件](https://www.jetbrains.com/legal/third-party-software/?product=IIU&version=2021.2.3)

# 调试

```bash

python3 -m http.server 3000 --bind 127.0.0.1  --directory docs
```

# 每天认识一个新命令

```bash
ssh -t command
ssh-copy-id
sshpass
ssh-agent
mosh，替代ssh的
pv  pipeline view可以查看管道进度
忽略knownhosts
ssh证书登录 [ruanyifeng](https://www.ruanyifeng.com/blog/2020/07/ssh-certificate.html)
```

每天认识一个新命令： https://einverne.github.io/post/2019/08/fzf-usage.html

# 杂项

* [mac使用gnu命令](https://blog.cotes.info/posts/use-gnu-utilities-in-mac/)
* 清除dns缓存 chrome , [runoob](https://www.runoob.com/w3cnote/chrome-clear-dns-cache.html)

  * 强制清空， 鼠标左键按住刷新按钮不放弹出子菜单，强制刷新
  * 浏览器缓存参考[认识浏览器缓存](https://segmentfault.com/a/1190000009970329)，查看浏览器缓存[查看缓存](https://blog.csdn.net/yerenyuan_pku/article/details/88881967)
  * chrome://about/
  * [nginx缓存](https://www.hi-linux.com/posts/64107.html)
* 证书

  * mkcert创建本地可信证书
  * https://letsencrypt.org/zh-cn/docs/certificates-for-localhost/
* k8s调试

  * [Telepresence](https://www.hi-linux.com/posts/21833.html)
  * sshuttle虚拟隧道，利用ssh构建虚拟隧道。
* [mvn 包冲突解决](https://segmentfault.com/a/1190000023446358)
* `crontab 支持重启运行脚本，语法如下@reboot /root/script/restart.sh `
* raesene/alpine-nettools:latest ，[仓库](https://github.com/fedora-cloud/Fedora-Dockerfiles/tree/master/ssh)
* [coreos](https://book.douban.com/subject/26670565/)

  * [docker coreos](https://github.com/wenshunbiao/docker)
* mac上替换docker工具 ，[lima](https://segmentfault.com/a/1190000040633750)
* [shell进程替换](http://c.biancheng.net/view/3025.html)
* 时区处理[cnblogs](https://www.cnblogs.com/yourbatman/p/14307194.html)
* [osquery工具](https://os.51cto.com/art/202001/609160.htm)
* git worktree
* utools 工具箱查看自己ip以及公网ip

# 常用命令

```bash
# xargs参考 [ruanyifeng](https://www.ruanyifeng.com/blog/2019/08/xargs-tutorial.html)
1. echo {1..10}|xargs -n 1 -t  echo 
2. paralell 并发执行
3. bash模式扩展，https://wangdoc.com/bash/expansion.html
4. navi命令行工具 https://github.com/denisidoro/navi
```

# 好博客

1. [hi-linux](https://www.hi-linux.com/categories/Linux/)
2. [yiyi bash手册](https://yiyibooks.cn/Phiix/bash_reference_manual/bash%E5%8F%82%E8%80%83%E6%96%87%E6%A1%A3.html)
3. [文档整篇翻译](https://zhuanlan.zhihu.com/p/37359779)
4. [linux shell编程指南](http://c.biancheng.net/shell/)
5. [linux系统管理](http://c.biancheng.net/linux_tutorial/)
6. [并发网](https://www.zhihu.com/answer/2157140104)

# 碎碎念

1. quicklook预览
2. 录屏神器BandiCam
3. mype支持网络功能的pe
4. geek uninstall
5. 星愿浏览器
6. 小丸工具箱
7. capslock+
8. deskreen投屏共享
9. gimp代替PS
10. spacesniffer 查看磁盘占用
11. anytxt
12. anlink
13. Giphy Capture
14. 妙手ocr
15. BookxNote Pro
16. potplayer

# idea插件

[40款idea插件](https://zhuanlan.zhihu.com/p/412113632)

[idea好用的插件](https://zhuanlan.zhihu.com/p/412956073)

[zhihu](https://zhuanlan.zhihu.com/p/130733659)

restfultookit插件自动生成请求

[idea好用插件](https://mp.weixin.qq.com/s/AxaQz9OyYmYs_L8Ef2kqJw)

[好用的命令行工具](https://mp.weixin.qq.com/s/ZTMwK5r1d2abXcOtnu6nEA)

# k8s集群备份

1. [weixin](https://mp.weixin.qq.com/s?__biz=MzI3MTI2NzkxMA==&mid=2247502728&idx=1&sn=04c17852082d9b03c0a95e8aab5bd8c9&chksm=eac6eaa1ddb163b7ed29bc0544d3accd499b30bfbf473df3bddd50bc67818f1a492e3f5ec07d&scene=90&subscene=93&sessionid=1638615728&clicktime=1638632572&enterid=1638632572&ascene=56&devicetype=android-29&version=28001057&nettype=WIFI&abtest_cookie=AAACAA%3D%3D&lang=zh_CN&exportkey=AS%2B8poSLqCU8Tu9SgC8Bbek%3D&pass_ticket=4DYMfcFTRRWaKypm%2FBcWLDbNqNBNLwWrBSH%2FeuGLIwnbVEno1xokT2g8AwPZ4ADu&wx_header=1)

# 杂项

1. rtty
2. pingtunnel
