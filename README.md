# zDocker-Mirror
这个项目是一个基于 Cloudflare Workers 的 Docker 镜像代理工具。它能够中转对 Docker 官方镜像仓库的请求，解决访问docker镜像地址，限制公开使用。
<img width="1499" height="901" alt="image" src="https://github.com/user-attachments/assets/66c5600f-9a6f-4e29-b689-0c34c43593b2" />

Warning
根据 Cloudflare 协议 中，2.2.1 第 (j) use the Services to provide a virtual private network or other similar proxy services.

用户需要添加修改配置文件的WHITE_LIST_IPS（修改为自己需要使用的IP白名单，非白名单IP拒绝访问.）
<img width="532" height="310" alt="image" src="https://github.com/user-attachments/assets/dd4a8a60-b7a3-41db-b8e6-380d8bfe997f" />


🚀 部署方式

1.cloudflare站点的支持

2.一个域名解析到cloudflare站点进行dns解析

3.Worker 部署：复制 worker.js 代码，保存并部署即可
