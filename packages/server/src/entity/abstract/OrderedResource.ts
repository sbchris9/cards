import { Field, ObjectType, Int } from 'type-graphql';
import { Resource } from './Resource';
import { Column } from 'typeorm';

@ObjectType({ isAbstract: true })
export abstract class OrderedResource extends Resource {
  @Field(_ => Int)
  @Column('smallint', { unsigned: true, default: 0 })
  position: number;
}
