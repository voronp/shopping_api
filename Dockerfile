FROM node:14 as serv

WORKDIR /src

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000
CMD ["node", "bin/www"]
