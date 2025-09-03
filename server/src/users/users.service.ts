import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(dto: RegisterDto): Promise<User> {
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(dto.password, salt);
    const user = this.usersRepository.create({
      email: dto.email,
      passwordHash,
    });
    return this.usersRepository.save(user);
  }

  async findOneById(id: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ email });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  setRefreshTokenHash(userId: string, hashed: string | null) {
    return this.usersRepository.update(
      { id: userId },
      { currentHashedRefreshToken: hashed },
    );
  }

  setPasswordResetToken(userId: string, tokenHash: string, expires: Date) {
    return this.usersRepository.update(
      { id: userId },
      { passwordResetTokenHash: tokenHash, passwordResetTokenExpires: expires },
    );
  }

  clearPasswordReset(userId: string) {
    return this.usersRepository.update(
      { id: userId },
      { passwordResetTokenHash: null, passwordResetTokenExpires: null },
    );
  }
}
