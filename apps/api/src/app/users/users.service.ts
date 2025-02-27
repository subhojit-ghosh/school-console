import { Inject, Injectable } from '@nestjs/common';
import { DRIZZLE, DrizzleDB, usersTable } from '@school-console/drizzle';
import bcrypt from 'bcryptjs';
import { asc, count, desc, eq, like } from 'drizzle-orm';
import { CreateUserDto, UpdateUserDto, UserQueryDto } from './users.dto';

@Injectable()
export class UsersService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  async findAll(query: UserQueryDto) {
    const {
      page = 1,
      size = 10,
      sortBy = 'createdAt',
      sortOrder = 'asc',
      name,
      username,
      role,
    } = query;
    const offset = (page - 1) * size;

    const whereConditions: any = [];
    if (name) {
      whereConditions.push(like(usersTable.name, `%${name}%`));
    }
    if (username) {
      whereConditions.push(like(usersTable.username, `%${username}%`));
    }
    if (role) {
      whereConditions.push(eq(usersTable.role, role));
    }

    const [users, totalRecords] = await Promise.all([
      this.db
        .select({
          id: usersTable.id,
          name: usersTable.name,
          username: usersTable.username,
          role: usersTable.role,
          createdAt: usersTable.createdAt,
          updatedAt: usersTable.updatedAt,
        })
        .from(usersTable)
        .where(whereConditions)
        .orderBy(
          sortOrder === 'asc'
            ? asc(usersTable[sortBy])
            : desc(usersTable[sortBy])
        )
        .limit(size)
        .offset(offset),
      this.db
        .select({ count: count() })
        .from(usersTable)
        .where(whereConditions)
        .then((res) => res[0].count),
    ]);

    const totalPages = Math.ceil(totalRecords / size);

    return {
      size,
      page,
      totalPages,
      totalRecords,
      data: users,
    };
  }

  async create(user: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(user.password, 12);
    user.password = hashedPassword;
    return await this.db.insert(usersTable).values(user);
  }

  async update(id: number, user: UpdateUserDto) {
    if (user.password) {
      user.password = await bcrypt.hash(user.password, 12);
    }
    return await this.db
      .update(usersTable)
      .set(user)
      .where(eq(usersTable.id, id));
  }
}
