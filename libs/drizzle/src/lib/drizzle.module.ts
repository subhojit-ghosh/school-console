import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { drizzle, MySql2Database } from 'drizzle-orm/mysql2';
import * as schema from './schemas';

export const DRIZZLE = Symbol('drizzle-connection');
export type DrizzleDB = MySql2Database<typeof schema>;
export * from './schemas';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: DRIZZLE,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL') as string;
        return drizzle(databaseUrl, {
          casing: 'snake_case',
        });
      },
    },
  ],
  exports: [DRIZZLE],
})
export class DrizzleModule {}
