# Node.jsのLTSバージョンを指定
FROM node:lts

WORKDIR /usr/src/app

RUN yarn global add @google/clasp