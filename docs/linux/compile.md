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

## 制作启动initram

下载busybox 静态编译

```shell
git clone --depth 1  https://github.com/mirror/busybox.git 
cd busybox
make menuconfig
Settings  --->
            [*] Build BusyBox as a static binary (no shared libs) 

# 制作rootfs
dd if=/dev/zero of=rootfs.img bs=1M count=10
mkfs.ext4 rootfs.img
```

## 启动内核

```shell
#  或者 -serial file:output.txt
qemu-system-x86_64 -kernel arch/x86/boot/bzImage -initrd arch/x86/boot/bzImage -append root=/dev/ram init=/linuxrc  -nographic -nographic -serial mon:stdio -append console=ttyS0

# 退出方法
# 1. 在另一个终端中输入 killall qemu-system-arm
# 2. 在 qemu 中 输入ctrl+a 抬起后，再输入’x’。
```

## FAQ

1. `git 下载出错，git config --global http.sslVerify false`

## 参考

[ubuntu2004编译linux](https://blog.csdn.net/qq_39819990/article/details/106605430)

[内核调试方式](https://www.zhihu.com/question/35565790)

[qemu+vscode调试内核](https://howardlau.me/programming/debugging-linux-kernel-with-vscode-qemu.html)

[net/blog/2021/debug_kernel_szp/](http://kerneltravel.net/blog/2021/debug_kernel_szp/)

[zhihu](https://zhuanlan.zhihu.com/p/412604505)

[tencent](https://cloud.tencent.com/developer/column/3087)

【Linux操作系统-构建自己的内核-哔哩哔哩】 https://b23.tv/3gyPzQu

【Linux 0.11内核分析课程-哔哩哔哩】 https://b23.tv/IF64X7U
