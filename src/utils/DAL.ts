import { PrismaClient } from '@prisma/client';
import { v4 } from 'uuid';
import { toSQLString } from './Formatter';

const prismaClient = new PrismaClient();

export const getUsers = async () => {
  return await prismaClient.users.findMany();
}

export const getUserByDiscordId = async (discord_id: string) => {
  return await prismaClient.users.findFirst({
    where: {
      user_discords: {
        every: {
          discord_id
        }
      }
    }
  });
}

export const getDiscordUser = async (discord_id: string) => {
  return await prismaClient.discords.findUnique({
    where: {
      discord_id
    }
  });
}

export const insertDiscordUser = async (id: string, handle: string) => {
  await prismaClient.discords.create({
    data: {
      discord_id: id,
      username: handle,
      created_at: new Date(),
      updated_at: new Date()
    }
  })
}

export const upsertUser = async (id: string, name: string, user_id: string) => {
  await prismaClient.users.upsert({
    create: {
      id: v4(),
      username: name,
      created_at: new Date(),
      updated_at: new Date(),
      user_discords: {
        create: {
          discord_id: id
        }
      }
    },
    update: {
      username: name,
      updated_at: new Date()
    },
    where: {
      id: user_id
    }
  })
}