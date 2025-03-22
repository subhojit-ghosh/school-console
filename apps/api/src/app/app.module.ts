import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ServeStaticModule } from '@nestjs/serve-static';
import { DrizzleModule } from '@school-console/drizzle';
import * as Joi from 'joi';
import { join } from 'path';
import { AcademicFeeController } from './academic-fees/academic-fees.controller';
import { AcademicFeeService } from './academic-fees/academic-fees.service';
import { AcademicYearsController } from './academic-years/academic-years.controller';
import { AcademicYearsService } from './academic-years/academic-years.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { ClassesController } from './classes/classes.controller';
import { ClassesService } from './classes/classes.service';
import { DashboardController } from './dashboard/dashboard.controller';
import { DashboardService } from './dashboard/dashboard.service';
import { PaymentsController } from './payments/payments.controller';
import { PaymentsService } from './payments/payments.service';
import { StudentsController } from './students/students.controller';
import { StudentsService } from './students/students.service';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        TZ: Joi.string().default('Asia/Kolkata'),
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        API_PORT: Joi.number().default(3000),
        JWT_SECRET: Joi.string().required(),
        DATABASE_URL: Joi.string().required(),
      }),
      isGlobal: true,
      cache: true,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../../', 'storage'),
    }),
    MulterModule.register({
      storage: diskStorage({
        destination: join(
          __dirname,
          '../../../apps/web/src/assets/',
          'uploads'
        ),
        filename: (req, file, cb) => {
          const filename = `${uuid()}.${file.originalname.split('.').pop()}`;
          console.log('debug-filename', filename);
          cb(null, filename);
        },
      }),
    }),
    DrizzleModule,
  ],
  controllers: [
    AppController,
    AuthController,
    DashboardController,
    StudentsController,
    ClassesController,
    PaymentsController,
    UsersController,
    AcademicYearsController,
    AcademicFeeController,
  ],
  providers: [
    AppService,
    UsersService,
    StudentsService,
    PaymentsService,
    DashboardService,
    ClassesService,
    AuthService,
    AcademicYearsService,
    AcademicFeeService,
  ],
})
export class AppModule {}
