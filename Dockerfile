FROM harbor.landhightech.com/infrastructure/node:24.1.0-alpine3.22 as TSBuilder
WORKDIR /build
COPY . .
RUN npm install --save --registry=https://registry.npmmirror.com && \
  npm run build

FROM harbor.landhightech.com/infrastructure/node:24.1.0-alpine3.22
ARG VERSION=''
ARG BUILD_TIME=''
ARG COMMIT_MESSAGE=''
LABEL VERSION=$VERSION
LABEL BUILD_TIME=$BUILD_TIME
LABEL COMMIT_MESSAGE=$COMMIT_MESSAGE
RUN npm install pm2 -g --registry=https://registry.npmmirror.com && \
  sed -i 's#https\?://dl-cdn.alpinelinux.org/alpine#https://mirrors.aliyun.com/alpine#g' /etc/apk/repositories && \
  apk update && \
  apk add tzdata
ENV TZ=Asia/Shanghai
WORKDIR /app
COPY --from=TSBuilder /build/dist .
COPY ./package.json .
RUN npm install --save --omit=dev --registry=https://registry.npmmirror.com
COPY ./pm2.config.js pm2.config.js
EXPOSE ${APP_PORT}
CMD ["pm2-runtime","start","pm2.config.js"]
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 CMD curl -fs http://localhost:${APP_PORT}/api/healthcheck || exit 1