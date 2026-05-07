# zDocker-Mirror
这个项目是一个基于 Cloudflare Workers 的 Docker 镜像代理工具。它能够中转对 Docker 官方镜像仓库的请求，解决访问docker镜像地址，限制公开使用。

Warning
根据 Cloudflare 协议 中，2.2.1 第 (j) use the Services to provide a virtual private network or other similar proxy services.

用户需要添加修改配置文件的WHITE_LIST_IPS（修改为自己需要使用的IP白名单，非白名单IP拒绝访问.）
<img width="706" height="251" alt="image" src="https://github.com/user-attachments/assets/6e40273d-8dd6-4ea0-a9fa-61cea9fab0a2" />

🚀 部署方式

1.cloudflare站点的支持

2.一个域名解析到cloudflare站点进行dns解析

3.Worker 部署：复制 worker.js 代码，保存并部署即可
