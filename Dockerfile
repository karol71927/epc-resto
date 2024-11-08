FROM node:18-alpine3.17

WORKDIR /usr/src/app

COPY . . 

RUN npm install 

RUN npm i -g @nestjs/cli@10.3.2

RUN npm run build

ENTRYPOINT [ "node", "dist/main.js" ]
