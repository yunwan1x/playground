![github](https://jeremyxu2010.github.io/images/20181013/image-20181014025406085.png)

# 参考

1. [archlinux 防火墙wiki](https://wiki.archlinux.org/title/Category:Firewalls_(%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87))

# iptables

1. 案例1策论路由，[oschina](https://my.oschina.net/mojiewhy/blog/3039897)

## 抓包命令

```shell
 tcpdump -i enp0s8 host 192.168.123.176 and not arp and  udp -n -X -S
# 参考 tcp三次握手抓包 http://xstarcd.github.io/wiki/shell/tcpdump_TCP_three-way_handshake.html
```

# nftables
