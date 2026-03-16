import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from "@prisma/client";
import pg from 'pg';
import logger from "./logger.js";
import env from "./env.js";

const connectionString = env.DATABASE_URL

const pool = new pg.Pool({ connectionString })
const adapter = new PrismaPg(pool as any)
const prisma = new PrismaClient({ adapter })
// Test connection
prisma.$connect()
    .then(() => logger.info("Database connected successfully"))
    .catch((err) => logger.error("Database connection failed", err));

export { prisma }