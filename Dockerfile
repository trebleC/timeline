# Dockerfile for timeline app

# 使用 nginx 作为基础镜像
FROM nginx:alpine

# 将构建好的文件复制到 nginx 的默认目录
COPY dist/ /usr/share/nginx/html/

# 复制自定义 nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]