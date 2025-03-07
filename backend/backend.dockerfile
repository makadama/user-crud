FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY prisma ./prisma

RUN npx prisma migrate deploy
RUN npx prisma generate

COPY . .

EXPOSE 4000

ENV HOST=0.0.0.0

CMD ["npm", "run", "dev"]
