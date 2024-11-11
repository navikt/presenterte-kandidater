FROM gcr.io/distroless/nodejs20-debian12
ENV NODE_ENV=production

WORKDIR /app

COPY .next/standalone /app/
COPY .next/static ./.next/static

USER nonroot

EXPOSE 3000

# Hostname for å kunne kalle isAlive og isReady 
ENV HOSTNAME "0.0.0.0" 

CMD ["server.js"]