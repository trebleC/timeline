# 部署到腾讯云 CVM (Docker 环境)

本文档介绍如何将本项目部署到腾讯云 CVM（云服务器）的 Docker 环境中。

## 前置要求

1. 拥有一个腾讯云 CVM 实例
2. CVM 上已安装 Docker
3. 拥有 CVM 的 SSH 访问权限
4. 腾讯云安全组已开放必要端口（HTTP 80, HTTPS 443, SSH 22）

## GitHub Action 配置

### 1. 设置 GitHub Secrets

在 GitHub 仓库中设置以下 Secrets：

1. 进入仓库 Settings → Secrets and variables → Actions
2. 添加以下 secrets：

| Secret Name | 描述 | 示例值 |
|-------------|------|--------|
| `CVM_HOST` | CVM 公网 IP 地址或域名 | |
| `CVM_USERNAME` | CVM 登录用户名 | `ubuntu` 或 `root` |
| `CVM_SSH_KEY` | SSH 私钥内容 | `-----BEGIN OPENSSH PRIVATE KEY-----...` |

### 2. SSH 密钥配置

确保本地公钥已添加到 CVM 的 `~/.ssh/authorized_keys` 文件中。

生成 SSH 密钥对（如果还没有）：
```bash
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

将公钥复制到 CVM：
```bash
ssh-copy-id username@your_cvm_ip
```

### 3. CVM 环境配置

在 CVM 上执行以下步骤：

1. 安装 Docker：
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install docker.io -y

# 启动 Docker 服务
sudo systemctl start docker
sudo systemctl enable docker

# 将当前用户添加到 docker 组（可选，避免每次使用 sudo）
sudo usermod -aG docker $USER
```

2. 验证 Docker 安装：
```bash
docker --version
```

## 部署流程

1. 推送代码到 `main` 或 `master` 分支
2. GitHub Action 会自动触发部署流程
3. 构建产物会被传输到 CVM 指定目录
4. 在 CVM 上构建 Docker 镜像并运行容器

## 手动部署

如果需要手动部署，可以在本地执行以下步骤：

1. 构建项目：
```bash
npm run build
```

2. 复制文件到服务器：
```bash
scp -r ./* username@your_cvm_ip:/home/ubuntu/timeline/
```

3. 在服务器上构建和运行 Docker 容器：
```bash
ssh username@your_cvm_ip << 'EOF'
cd /home/ubuntu/timeline/

# 停止并删除现有容器
docker stop timeline-app || true
docker rm timeline-app || true

# 构建新镜像
docker build -t timeline-app .

# 运行容器
docker run -d \
  --name timeline-app \
  -p 80:80 \
  timeline-app
EOF
```

## 故障排除

### 权限问题

如果遇到权限问题，确保用户在 docker 组中：
```bash
sudo usermod -aG docker $USER
```

然后注销并重新登录。

### Docker 镜像构建问题

检查 Dockerfile 是否正确：
```bash
docker build -t timeline-app .
```

查看构建日志以诊断问题。

### 容器运行问题

查看容器日志：
```bash
docker logs timeline-app
```

进入容器内部调试：
```bash
docker exec -it timeline-app /bin/sh
```

### 查看部署日志

在 GitHub Actions 页面查看部署过程中的详细日志，可以帮助诊断问题。