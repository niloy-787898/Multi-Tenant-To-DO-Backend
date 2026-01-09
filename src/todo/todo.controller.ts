import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtTenantGuard } from '../auth/guards/jwt-tenant.guard';
import { TenantQueryRunnerInterceptor } from '../database/tenant/tenant-queryrunner.interceptor';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodoService } from './todo.service';

@UseGuards(JwtTenantGuard)
@UseInterceptors(TenantQueryRunnerInterceptor)
@Controller('todos')
export class TodoController {
    constructor(private readonly todoService: TodoService) { }

    @Get()
    findAll(
        @Query('page') page = '1',
        @Query('limit') limit = '10',
        @Query('search') search = '',
    ) {
        return this.todoService.findAll({
            page: Number(page),
            limit: Number(limit),
            search,
        });
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.todoService.findOne(id);
    }

    @Post()
    create(@Body() dto: CreateTodoDto) {
        return this.todoService.create(dto);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateTodoDto) {
        return this.todoService.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.todoService.remove(id);
    }
}
