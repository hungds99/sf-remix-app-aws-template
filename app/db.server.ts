import { PrismaClient } from "@prisma/client";

declare global {
  var prismaClient: PrismaClient;
}

const prismaClient: PrismaClient = global.prismaClient || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  if (!global.prismaClient) {
    global.prismaClient = new PrismaClient();
  }
}

export default prismaClient;
