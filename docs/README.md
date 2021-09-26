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
```

# 杂项

* [mac使用gnu命令](https://blog.cotes.info/posts/use-gnu-utilities-in-mac/)
* 清除dns缓存 chrome , [runoob](https://www.runoob.com/w3cnote/chrome-clear-dns-cache.html)

  * 强制清空， 鼠标左键按住刷新按钮不放弹出子菜单，强制刷新
  * 浏览器缓存参考[认识浏览器缓存](https://segmentfault.com/a/1190000009970329)，查看浏览器缓存[查看缓存](https://blog.csdn.net/yerenyuan_pku/article/details/88881967)
  * chrome://about/
* 证书

  * mkcert创建本地可信证书
* k8s调试

  * [Telepresence](https://www.hi-linux.com/posts/21833.html)
  * sshuttle虚拟隧道，利用ssh构建虚拟隧道。
* [mvn 包冲突解决](https://segmentfault.com/a/1190000023446358)
* `crontab 支持重启运行脚本，语法如下@reboot /root/script/restart.sh `
* raesene/alpine-nettools:latest ，[仓库](https://github.com/fedora-cloud/Fedora-Dockerfiles/tree/master/ssh)

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
