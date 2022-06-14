# develop stage
FROM node:18.3.0 as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
# production stage
FROM node:18.3.0-alpine as production-stage
WORKDIR /app
COPY --from=build-stage /app/dist .
COPY --from=build-stage /app/src/metrics/*.lua .
EXPOSE 3000
CMD [ "npm", "start" ]