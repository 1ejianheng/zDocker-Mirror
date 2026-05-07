# zDocker-Mirror
这个项目是一个基于 Cloudflare Workers 的 Docker 镜像代理工具。它能够中转对 Docker 官方镜像仓库的请求，解决一些访问限制和加速访问的问题。

用户需要添加修改配置文件的WHITE_LIST_IPS（修改为自己需要使用的IP白名单，非白名单IP拒绝访问.）
