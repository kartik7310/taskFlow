import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from "@prisma/client";
import logger from "./logger.js";
import env from "./env.js";

const connectionString = env.DATABASE_URL

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })
logger.info("Database connected successfully");



export { prisma }