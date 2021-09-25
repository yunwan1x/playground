# 调试

```bash

python3 -m http.server 3000 --bind 127.0.0.1  --directory docs
```

# command

```bash

nmap pv read  rsync scp sar screen tmux
telnet script sort source strace 
ssh ssh-agent ssh-keygen ssh-keyscan
openssl
socat tr time tee tcpdump tar zip tail head stty sleep scriptreplay host id
mc
ip
find
which
lsof
htop
top
free
du
df
mount
nc
sed
awk
grep

```

# ssh命令完全解析

```bash
ssh -t command
ssh-copy-id
sshpass
ssh-agent
mosh，替代ssh的
```

# 杂项

* [mac使用gnu命令](https://blog.cotes.info/posts/use-gnu-utilities-in-mac/)
* 清除dns缓存 chrome , [runoob](https://www.runoob.com/w3cnote/chrome-clear-dns-cache.html)
  * 强制清空， 鼠标左键按住刷新按钮不放弹出子菜单，强制刷新
  * 浏览器缓存参考[认识浏览器缓存](https://segmentfault.com/a/1190000009970329)，查看浏览器缓存[查看缓存](https://blog.csdn.net/yerenyuan_pku/article/details/88881967)
  * chrome://about/
*

# 常用命令

```bash
# xargs参考 [ruanyifeng](https://www.ruanyifeng.com/blog/2019/08/xargs-tutorial.html)
1. echo {1..10}|xargs -n 1 -t  echo 
2. paralell 并发执行
3. bash模式扩展，https://wangdoc.com/bash/expansion.html
```
