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
ENV ACCESS_TOKEN_SECRET=c0806f9e97ede0f7f21f19946d422af709a2bd0ed5b7c3644a9520e67fa9c9dae6d16ff91717587aad207aa9adebde1bfeac714abdb299223ae72e97acc48c56
ENV REFRESH_TOKEN_SECRET=78e39ca3ae1fd9bbb05c3102f9f594d29ace025da0f643552a8142b16a12d16008152e761cf466e9387d6f1223f224cb7f9b6138d53b543f44abdf242d251a50
ENV PASSWORD_SECRET=pstxsdw
ENV PORT=8080

EXPOSE 80
CMD [ "yarn", "serve" ]

### FOR PROD
FROM base as production

# compile TS and put into that build folder in container
RUN yarn run build

CMD [ "yarn", "start" ]