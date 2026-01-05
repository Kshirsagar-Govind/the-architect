// first select test db
import dotenv from "dotenv";
dotenv.config({ path: ".env.test" });

// then export prisma client
import { PrismaClient } from "@prisma/client";
import { execSync } from "child_process";
export const prisma = new PrismaClient();

beforeAll(() => {
  // Test DB clean + migrate
  execSync("npx prisma migrate reset --force --skip-seed", {
    stdio: "inherit",
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});
