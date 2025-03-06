import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ClassQueryDto, CreateClassDto, UpdateClassDto } from './classes.dto';
import { ClassesService } from './classes.service';

@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Get()
  async findAll(@Query() query: ClassQueryDto) {
    return this.classesService.findAll(query);
  }

  @Get('dropdown')
  async findAllForDropdown() {
    return this.classesService.findAllForDropdown();
  }

  @Post()
  async create(@Body() body: CreateClassDto) {
    return this.classesService.create(body);
  }

  @Put(':id')
  async update(@Body() body: UpdateClassDto, @Param('id') id: number) {
    return this.classesService.update(id, body);
  }
}
