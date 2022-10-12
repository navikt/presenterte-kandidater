FROM navikt/node-express:16

WORKDIR /var

COPY build/ build/
COPY node_modules/ node_modules/
COPY package.json package.json

EXPOSE 3000
ENTRYPOINT ["npm", "start"]
