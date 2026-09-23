FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:24
ENV NODE_ENV=production

WORKDIR /app

COPY .next/standalone /app/
COPY .next/static ./.next/static

USER nonroot

EXPOSE 3000

CMD ["server.js"]
