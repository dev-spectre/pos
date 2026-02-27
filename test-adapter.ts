import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import ws from 'ws';

// Required for neon serverless driver over websockets
globalThis.WebSocket = ws as any;

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("No DB URL");

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Connecting...");
  const cat = await prisma.category.upsert({
    where: { id: "test-valid-cat" },
    create: { id: "test-valid-cat", name: "Valid Category", isDefault: false },
    update: { name: "Valid Category" }
  });
  console.log("Upserted Category:", cat);
}

main().catch(console.error).finally(() => prisma.$disconnect());
