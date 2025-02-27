import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto, UserQueryDto } from './users.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(@Query() query: UserQueryDto) {
    return this.usersService.findAll(query);
  }

  @Post()
  async create(@Body() body: CreateUserDto) {
    return this.usersService.create(body);
  }

  @Put(':id')
  async update(@Body() body: UpdateUserDto, @Param('id') id: number) {
    return this.usersService.update(id, body);
  }
}
