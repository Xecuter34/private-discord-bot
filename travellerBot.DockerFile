FROM node:alpine

WORKDIR /app

ENV DATABASE_URL="postgresql://postgres:QbAhY37wUp%23@host.docker.internal:5432/Bots?schema=public"

COPY ./package.json .
COPY ./prisma/schema.prisma ./prisma/schema.prisma
COPY ./dist dist/

RUN yarn install
RUN npx prisma db pull
RUN npx prisma generate

CMD ["yarn", "start"]

# NEED TO FIX THIS SO IT BUILD HERE TOO!
# Look at multistage