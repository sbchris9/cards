FROM node:12

WORKDIR /app

RUN npm install -g lerna

RUN mkdir packages
RUN mkdir packages/web
RUN mkdir packages/common

COPY lerna.json ./
COPY package.json ./
COPY packages/web/package.json packages/web/ 
COPY packages/common/package.json packages/common/ 

RUN lerna bootstrap

ADD . .

RUN cd ./packages/common && npm run build:prod

CMD cd ./packages/web && npm run build && rm -rf /app/packages/web/dist/** && mv /app/packages/web/build /app/packages/web/dist
