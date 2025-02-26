import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { DashboardController } from './dashboard/dashboard.controller';
import { StudentsController } from './students/students.controller';
import { ClassesController } from './classes/classes.controller';
import { PaymentsController } from './payments/payments.controller';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { StudentsService } from './students/students.service';
import { PaymentsService } from './payments/payments.service';
import { DashboardService } from './dashboard/dashboard.service';
import { ClassesService } from './classes/classes.service';
import { AuthService } from './auth/auth.service';

@Module({
  imports: [],
  controllers: [
    AppController,
    AuthController,
    DashboardController,
    StudentsController,
    ClassesController,
    PaymentsController,
    UsersController,
  ],
  providers: [
    AppService,
    UsersService,
    StudentsService,
    PaymentsService,
    DashboardService,
    ClassesService,
    AuthService,
  ],
})
export class AppModule {}
