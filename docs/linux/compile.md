# 编译调试

1. 下载[linux 源码](https://mirrors.tuna.tsinghua.edu.cn/help/linux.git/)，

   ```shell
   git clone --depth 1 https://mirrors.tuna.tsinghua.edu.cn/git/linux.git
   ```
2. ubuntu20.04,安装编译工具

   ```
   # 安装编译工具
   sudo apt update && sudo apt install libncurses5-dev openssl libssl-dev build-essential pkg-config libc6-dev bison flex libelf-dev zlibc minizip libidn11-dev libidn11
   # 安装qemu
   apt install qemu-system-x86  qemu-utils

   # 安装ccache
   sudo apt install ccache

   cat << EOF >>~/.bashrc
   export USE_CCACHE=1 
   export CCACHE_DIR="/home/wy/.ccache" 
   export CC="ccache gcc"  
   export CXX="ccache g++"  
   export PATH="$PATH:/usr/lib/ccache"
   EOF 

   source ~/.bashrc
   # 设定50G的缓存上限
   ccache -M 50G

   ````

## 参考

[ubuntu2004编译linux](https://blog.csdn.net/qq_39819990/article/details/106605430)

[qemu+vscode调试内核](https://howardlau.me/programming/debugging-linux-kernel-with-vscode-qemu.html)

[tencent](https://cloud.tencent.com/developer/column/3087)

【Linux操作系统-构建自己的内核-哔哩哔哩】 https://b23.tv/3gyPzQu

【Linux 0.11内核分析课程-哔哩哔哩】 https://b23.tv/IF64X7U
