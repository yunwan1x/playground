# 编译调试

1. 下载[linux 源码](https://mirrors.tuna.tsinghua.edu.cn/help/linux.git/)，参考书籍： 深度探索linux操作系统

   ```shell
   git clone --depth 1 https://mirrors.tuna.tsinghua.edu.cn/git/linux.git
   ```
2. ubuntu20.04,安装编译工具

   ```shell
   # 安装编译工具
   sudo apt update && sudo apt install libncurses5-dev openssl libssl-dev build-essential pkg-config libc6-dev bison flex libelf-dev zlib1g minizip libidn11-dev libidn11
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
   ccache -M 50
   ```

# 编译busybox,制作启动盘

```shell
git clone --depth 1  https://github.com/mirror/busybox.git 
cd busybox
make menuconfig
Settings  --->
            [*] Build BusyBox as a static binary (no shared libs) 

# 制作rootfs
dd if=/dev/zero of=rootfs.img bs=1M count=10
mkfs.ext4 rootfs.img
# 创建用于挂载该镜像文件的目录fs，挂载后才能往里面写入busybox。 使用mount命令将rootfs.img挂载到fs目录，编译busybox并写入fs目录中。
mkdir fs
sudo mount -t ext4 -o loop rootfs.img ./fs
sudo make install CONFIG_PREFIX=./fs
# 接下来对写入的busybox进行补充配置。
cd fs 
sudo mkdir proc dev etc home mnt
sudo cp -r ../examples/bootfloppy/etc/* etc/
cd ..
sudo chmod -R 777 fs/
# 卸载fs
sudo umount fs
```

# 编译内核

```shell
cp /boot/config-$(uname -r) .config
make menuconfig
# 进入内核代码目录 ./scripts/config -e DEBUG_INFO -e GDB_SCRIPTS -e CONFIG_DEBUG_SECTION_MISMATCH -d CONFIG_RANDOMIZE_BASE 

make -j4 vmlinux bzImage
```

# 启动内核

```shell
#  或者 -serial file:output.txt

qemu-system-x86_64 -kernel arch/x86/boot/bzImage  -hda ./busybox-1.32.0/rootfs.img  -append "root=/dev/sda console=ttyS0" -nographic

或者
mkinitramfs -o ramdisk.img
qemu-system-x86_64 \
  -kernel arch/x86_64/boot/bzImage \
  -nographic \
  -append "console=ttyS0 nokaslr" \
  -initrd ramdisk.img \
  -m 1024 \
  -s -S
# 退出方法
# 1. 在另一个终端中输入 killall qemu-system-arm
# 2. 在 qemu 中 输入ctrl+a 抬起后，再输入’x’。
```

# FAQ

1. `git 下载出错，git config --global http.sslVerify false`
2. > make[1]: *** No rule to make target 'debian/certs/benh@debian.org.cert.pem', needed by 'certs/x509_certificate_list'  ， 遇到这个证书错误，此时需要编辑一下.config，将CONFIG_SYSTEM_TRUSTED_KEYS置为空：CONFIG_SYSTEM_TRUSTED_KEYS = ""
   >



# 参考

[ubuntu2004编译linux](https://blog.csdn.net/qq_39819990/article/details/106605430)

[initd文件制作方式](https://developer.aliyun.com/article/47872)

[内核调试方式](https://www.zhihu.com/question/35565790)

[qemu+vscode调试内核](https://howardlau.me/programming/debugging-linux-kernel-with-vscode-qemu.html)

[net/blog/2021/debug_kernel_szp/](http://kerneltravel.net/blog/2021/debug_kernel_szp/)

[zhihu](https://zhuanlan.zhihu.com/p/412604505)

[tencent](https://cloud.tencent.com/developer/column/3087)

【Linux操作系统-构建自己的内核-哔哩哔哩】 https://b23.tv/3gyPzQu

【Linux 0.11内核分析课程-哔哩哔哩】 https://b23.tv/IF64X7U
