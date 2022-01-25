import { PrismaClient } from '@prisma/client';
import { v4 } from 'uuid';

const prismaClient = new PrismaClient();

/**
 * 
 * @returns An array of users.
 */
export const getUsers = async () => {
  return await prismaClient.users.findMany();
}

/**
 * 
 * @param discord_id Discord User ID
 * @returns A single user.
 */
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

/**
 * 
 * @param discord_id Discord User ID
 * @returns A single discord user.
 */
export const getDiscordUser = async (discord_id: string) => {
  return await prismaClient.discords.findUnique({
    where: {
      discord_id
    }
  });
}

/**
 * 
 * @param id Discord User ID
 * @param handle Discord Username
 */
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

/**
 * 
 * @param id Discord User ID
 * @param name A string value for name
 * @param user_id User ID
 */
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