<<<<<<< HEAD
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
=======
import { Entity,  PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
>>>>>>> d2fe01e01f7beb54a8417a4612a3f926d0251227
import { Account } from './account.entity';
import { Profile } from './profile.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 20, default: 'User' })
  role: string;

  @Column({ type: 'boolean', default: false })
  disabled: boolean;

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: 'uuid', nullable: true })
  created_by: string;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'uuid', nullable: true })
  updated_by: string;

  // Relations
  @OneToMany(() => Account, account => account.user)
  accounts: Account[];

  @OneToMany(() => Profile, profile => profile.user)
  profiles: Profile[];
}
