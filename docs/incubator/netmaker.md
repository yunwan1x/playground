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

1. [netmaker](https://github.com/gravitl/netmaker)
2. [netclient](https://github.com/gravitl/netmaker/releases)
3. [coredns](https://github.com/SekoiaLab/netmaker-coredns)
4. [netmaker-ui](https://github.com/mattkasun/netmaker-gui)
5. [wireguard](https://www.wireguard.com/install/#macos-app-store)
