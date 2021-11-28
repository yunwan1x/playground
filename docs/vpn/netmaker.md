## netmaker 新的wireguard组网工具

```yaml
version: "3.4"

services:
  netmaker:
    container_name: netmaker
    image: gravitl/netmaker:v0.8.2
    volumes:
      - /etc/netclient/config:/etc/netclient/config
      - dnsconfig:/root/config/dnsconfig
      - /etc/systemd/system:/etc/systemd/system
      - /usr/bin/wg:/usr/bin/wg
      - /data/sqldata/:/root/data
    cap_add:
      - NET_ADMIN
    restart: always
    network_mode: host
    environment:
      SERVER_HOST: "0.0.0.0"
      COREDNS_ADDR: "0.0.0.0"
      GRPC_SSL: "off"
      DNS_MODE: "on"
      CLIENT_MODE: "on"
      API_PORT: "8081"
      GRPC_PORT: "50051"
      SERVER_GRPC_WIREGUARD: "off"
      CORS_ALLOWED_ORIGIN: "*"
      DATABASE: "sqlite"
  netmaker-ui:
    container_name: netmaker-ui
    depends_on:
      - netmaker
    image: gravitl/netmaker-ui:v0.8
    environment:
      BACKEND_URL: "http://192.168.1.3:8081"
    restart: always
    network_mode: host
  coredns:
    depends_on:
      - netmaker
    image: coredns/coredns
    command: -conf /root/dnsconfig/Corefile
    container_name: coredns
    restart: always
    network_mode: host
    volumes:
      - dnsconfig:/root/dnsconfig
volumes:
  dnsconfig: {}
```

1. [quickinstall](https://docs.netmaker.org/server-installation.html)
2. [netmaker](https://github.com/gravitl/netmaker)
3. [netclient](https://github.com/gravitl/netmaker/releases)
4. [coredns](https://github.com/SekoiaLab/netmaker-coredns)
5. [netmaker-ui](https://github.com/mattkasun/netmaker-gui)
6. [wireguard](https://www.wireguard.com/install/#macos-app-store)

# 其他的vpn工具

1. [n2n](https://530503.xyz/articles/2021/01/11/1610357767246.html)
2. tailscale
3. [tinc](https://chanix.github.io/TincCookbook/)
4. [GOST](https://github.com/ginuerzh/gost)
5. [frp](https://github.com/fatedier/frp)

# tailscale derp

[docker镜像](https://hub.docker.com/r/chestnutprog/derper) , 用如下配置配置管理台setting

```json
 "ACLs": [
    // Match absolutely everything. Comment out this section if you want
    // to define specific ACL restrictions.
    { "Action": "accept", "Users": ["*"], "Ports": ["*:*"] },
  ],
  "derpMap": {
    "Regions": { "900": {
      "RegionID": 900,
      "RegionCode": "myderp",
      "Nodes": [{
          "Name": "1",
          "RegionID": 900,
          "HostName":"yourhostname.com",
      }]
    }}
  }
```
