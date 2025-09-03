import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ nullable: false })
  passwordHash!: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role!: UserRole;

  @Column({ type: 'text', nullable: true })
  currentHashedRefreshToken?: string | null;

  @Column({ type: 'text', nullable: true })
  passwordResetTokenHash?: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  passwordResetTokenExpires?: Date | null;
}
