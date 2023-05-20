FROM node:latest
ENV PATH /app/node_modules/.bin:$PATH
RUN mkdir /home/app 
COPY . /home/app
WORKDIR /home/app
RUN rm -rf node_modules --force
RUN npm install --force
ENTRYPOINT ["npm", "start"]