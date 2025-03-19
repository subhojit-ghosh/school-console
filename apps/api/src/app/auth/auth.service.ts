import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DRIZZLE, DrizzleDB, usersTable } from '@school-console/drizzle';
import bcrypt from 'bcryptjs';
import { and, eq } from 'drizzle-orm';
import moment from 'moment';

@Injectable()
export class AuthService {
  constructor(
    @Inject(DRIZZLE) private db: DrizzleDB,
    private jwtService: JwtService
  ) {}

  async login(username: string, password: string) {
    const user = await this.db
      .select()
      .from(usersTable)
      .where(
        and(eq(usersTable.username, username), eq(usersTable.isActive, true))
      )
      .limit(1)
      .then((rows) => rows[0]);

    if (!user) {
      throw new BadRequestException('Invalid username or password');
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      throw new BadRequestException('Invalid username or password');
    }

    const payload = {
      id: user.id,
      name: user.name,
      username: user.username,
      role: user.role,
    };

    const now = moment();

    // Set expiration to the next 3 AM
    const expirationTime = now
      .clone()
      .set({ hour: 3, minute: 0, second: 0, millisecond: 0 });

    // If it's already past 3 AM today, move to the next day's 3 AM
    if (
      now.isAfter(expirationTime) ||
      expirationTime.diff(now, 'minutes') < 30
    ) {
      expirationTime.add(1, 'day');
    }

    expirationTime.add(Math.floor(Math.random() * 10), 'minutes');

    // Calculate expiration in seconds
    const expiresInSeconds = expirationTime.diff(now, 'seconds');

    return {
      access_token: await this.jwtService.signAsync(payload, {
        expiresIn: expiresInSeconds,
      }),
    };
  }
}
