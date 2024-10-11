import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  readonly id!: number;

  @Column('varchar', { length: 50, nullable: false })
  public name!: string;

  @Column('varchar', {
    name: 'email',
    length: '255',
    nullable: false,
    unique: true,
  })
  public email!: string;

  @Column('varchar', { name: 'password', length: '255', nullable: false })
  public password!: string;

  @CreateDateColumn({ name: 'created_at' })
  readonly createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  readonly updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  readonly deletedAt!: Date;
}
