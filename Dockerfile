FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
RUN addgroup -S expressjs && adduser -S expressjs -G expressjs
USER expressjs
EXPOSE 3000
CMD ["node", "index.js"]