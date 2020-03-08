FROM node:12

WORKDIR /app

RUN npm install -g lerna
RUN npm install -g pm2
RUN npm install -g ts-node

RUN mkdir packages
RUN mkdir packages/server
RUN mkdir packages/common

COPY lerna.json ./
COPY package.json ./
COPY packages/server/package.json packages/server/ 
COPY packages/common/package.json packages/common/ 

RUN lerna bootstrap

ADD . .

RUN cd ./packages/common && npm run build:prod

EXPOSE 4000

# RUN cp ormconfig.js ./packages/server/ormconfig.js
# RUN cp ormconfig.js ./packages/server/dist/ormconfig.js

CMD cd ./packages/server && ts-node ./src/index.ts
