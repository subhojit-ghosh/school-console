import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'mysql',
  schema: './libs/drizzle/src/lib/schemas',
  casing: 'snake_case',
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
  },
});
