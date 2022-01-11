# 编译调试

1. 下载[linux 源码](https://mirrors.tuna.tsinghua.edu.cn/help/linux.git/)，

   ```shell
   git clone --depth 1 https://mirrors.tuna.tsinghua.edu.cn/git/linux.git
   ```
2. ubuntu20.04,安装编译工具

   ```
   sudo apt update && sudo apt install libncurses5-dev openssl libssl-dev build-essential pkg-config libc6-dev bison flex libelf-dev zlibc minizip libidn11-dev libidn11
   ````

## 参考

[ubuntu2004编译linux](https://blog.csdn.net/qq_39819990/article/details/106605430)

[qemu+vscode调试内核](https://howardlau.me/programming/debugging-linux-kernel-with-vscode-qemu.html)
