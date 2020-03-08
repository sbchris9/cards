import {
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn
} from 'typeorm';
import { ID, Field, ObjectType } from 'type-graphql';

@ObjectType({ isAbstract: true })
export abstract class Resource extends BaseEntity {
  @Field(_ => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
