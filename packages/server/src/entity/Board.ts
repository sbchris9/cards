import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './User';
import { ObjectType, Field } from 'type-graphql';
import { Row } from './Row';
import { OrderedResource } from './abstract/OrderedResource';
import { IBoard, Lazy } from '@ww/common';

@ObjectType()
@Entity()
export class Board extends OrderedResource implements IBoard {
  @Field()
  @Column()
  name: string;

  // Relations
  @Field(_type => User)
  @ManyToOne(
    _type => User,
    user => user.boards,
    { lazy: true, onDelete: 'CASCADE' }
  )
  @JoinColumn()
  user: Lazy<User>;

  @Field(_type => [Row])
  @OneToMany(
    _type => Row,
    row => row.board,
    { lazy: true, cascade: ['remove'] }
  )
  rows: Lazy<Row[]>;
}
