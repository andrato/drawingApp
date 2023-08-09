### FOR TESTING
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

# set args
ENV MONGO_USERS=mongodb+srv://general:S5GANK3iobHnzvF8@drawing.wvoxhls.mongodb.net/users_info?retryWrites=true&w=majority
ENV PORT=8004

EXPOSE 8004

CMD [ "yarn", "serve" ]

### FOR PROD
FROM base as production

# compile TS and put into that build folder in container
RUN yarn run build

CMD [ "yarn", "start" ]