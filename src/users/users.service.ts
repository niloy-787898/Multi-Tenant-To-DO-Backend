import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../database/entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly userRepo: Repository<User>) {}

  findByEmail(email: string) {
    return this.userRepo.findOne({ where: { email } });
  }

  createUser(data: { email: string; passwordHash: string; tenantId: string }) {
    const user = this.userRepo.create(data);
    return this.userRepo.save(user);
  }

  findById(id: string) {
    return this.userRepo.findOne({ where: { id } });
  }

  async updateRefreshTokenHash(userId: string, hash: string | null) {
    await this.userRepo
      .createQueryBuilder()
      .update(User)
      .set({ refreshTokenHash: hash })
      .where('id = :id', { id: userId })
      .execute();
  }
}
