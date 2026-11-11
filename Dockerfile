FROM node:24-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY app.js .

FROM gcr.io/distroless/nodejs24-debian13:nonroot

WORKDIR /app

COPY --from=build --chown=nonroot:nonroot /app/node_modules ./node_modules
COPY --from=build --chown=nonroot:nonroot /app/app.js ./app.js

ENV NODE_ENV=production

EXPOSE 3000

CMD ["app.js"]
