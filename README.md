# chatroom-with-track

FROM node:20-alpine
WORKDIR /app
COPY package.json ./yarn.lock ./
RUN yarn install

# copy all files

COPY . .
RUN yarn build-css
CMD ["yarn", "dev"]
EXPOSE 3000
