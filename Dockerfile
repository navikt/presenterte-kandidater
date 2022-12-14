FROM navikt/node-express:16

WORKDIR /var

COPY build/ build/
COPY server/build server/
COPY public/build public/build
COPY node_modules/ node_modules/

EXPOSE 3000
ENTRYPOINT ["node", "./server/server.js"]
