FROM gcr.io/distroless/nodejs18-debian11

WORKDIR /var

COPY build/ build/
COPY server/build server/
COPY public/build public/build
COPY node_modules/ node_modules/

EXPOSE 3000
CMD ["./server/server.js"]
