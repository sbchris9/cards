import { Entity, Column, OneToMany } from 'typeorm';
import { ObjectType, Field } from 'type-graphql';
import { Board } from './Board';
import { Resource } from './abstract/Resource';
import { IUser, Lazy } from '@ww/common';

@ObjectType()
@Entity()
export class User extends Resource implements IUser {
  @Field()
  @Column({
    unique: true
  })
  username: string;

  @Column()
  password: string;

  @Column('int', { default: 0 })
  tokenVersion: number;

  @Field(_type => [Board])
  @OneToMany(
    _type => Board,
    board => board.user,
    { lazy: true, cascade: ['remove'] }
  )
  boards: Lazy<Board[]>;
}
