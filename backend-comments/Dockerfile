### FOR DEV
FROM node:20 as base

# Create app directory
RUN mkdir -p /app
WORKDIR /app

# Install app dependencies
COPY package.json /app
COPY yarn.lock /app
RUN yarn

# Bundle app source
COPY . /app
RUN yarn build

# set args/env vars
ENV MONGO_AUTH=mongodb+srv://general:S5GANK3iobHnzvF8@drawing.wvoxhls.mongodb.net/comments?retryWrites=true&w=majority
ENV PORT=8005

EXPOSE 8005

CMD [ "yarn", "serve" ]

### FOR PROD
FROM base as production

# compile TS and put into that build folder in container
RUN yarn run build

CMD [ "yarn", "start" ]
