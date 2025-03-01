import { Module } from '@nestjs/common';
import { DrizzleModule } from '@school-console/drizzle';
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

@Module({
  imports: [DrizzleModule],
  controllers: [
    AppController,
    AuthController,
    DashboardController,
    StudentsController,
    ClassesController,
    PaymentsController,
    UsersController,
    AcademicYearsController,
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
  ],
})
export class AppModule {}
