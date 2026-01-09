import { Injectable, NotFoundException } from '@nestjs/common';
import { TenantEntityManager } from '../database/tenant/tenant-entity-manager';
import { Todo } from './entities/todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TodoService {
    constructor(private readonly tenantEm: TenantEntityManager) { }

    private async repo() {
        const manager = await this.tenantEm.getManager();
        return manager.getRepository(Todo);
    }

    async findAll(query: { page: number; limit: number; search?: string }) {
        const repo = await this.repo();

        const page = Math.max(1, query.page || 1);
        const limit = Math.min(50, Math.max(1, query.limit || 10));
        const skip = (page - 1) * limit;

        const qb = repo
            .createQueryBuilder('t')
            .orderBy('t.createdAt', 'DESC')
            .skip(skip)
            .take(limit);

        if (query.search?.trim()) {
            qb.andWhere('t.title ILIKE :s', { s: `%${query.search.trim()}%` });
        }

        const [items, total] = await qb.getManyAndCount();

        return {
            items,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }



    async findOne(id: string) {
        const repo = await this.repo();
        const todo = await repo.findOne({ where: { id } });
        if (!todo) throw new NotFoundException('Todo not found');
        return todo;
    }

    async create(dto: CreateTodoDto) {
        const repo = await this.repo();
        const todo = repo.create({
            title: dto.title,
            description: dto.description,
            isCompleted: false,
        });
        return repo.save(todo);
    }

    async update(id: string, dto: UpdateTodoDto) {
        const repo = await this.repo();
        const todo = await repo.findOne({ where: { id } });
        if (!todo) throw new NotFoundException('Todo not found');

        Object.assign(todo, dto);
        return repo.save(todo);
    }

    async remove(id: string) {
        const repo = await this.repo();
        const result = await repo.delete({ id });
        if (!result.affected) throw new NotFoundException('Todo not found');
        return { deleted: true };
    }
}
