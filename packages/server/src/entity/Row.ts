import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ObjectType, Field } from 'type-graphql';
import { Board } from './Board';
import { Card } from './Card';
import { OrderedResource } from './abstract/OrderedResource';
import { IRow, Lazy } from '@ww/common';

@ObjectType()
@Entity()
export class Row extends OrderedResource implements IRow {
  @Field({ nullable: true })
  @Column({ nullable: true })
  color?: string;

  //Relations
  @Field(_type => Board)
  @ManyToOne(
    _type => Board,
    board => board.rows,
    { lazy: true, onDelete: 'CASCADE' }
  )
  @JoinColumn()
  board: Lazy<Board>;

  @Field(_type => [Card])
  @OneToMany(
    _type => Card,
    card => card.row,
    { lazy: true, cascade: ['remove'] }
  )
  cards: Lazy<Card[]>;
}
