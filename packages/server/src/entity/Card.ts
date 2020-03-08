import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ObjectType, Field } from 'type-graphql';
import { Row } from './Row';
import { OrderedResource } from './abstract/OrderedResource';
import { ICard, Lazy } from '@ww/common';

@ObjectType()
@Entity()
export class Card extends OrderedResource implements ICard {
  @Field({ nullable: true })
  @Column({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  content?: string;

  //Relations
  @ManyToOne(
    _type => Row,
    row => row.cards,
    { lazy: true, onDelete: 'CASCADE' }
  )
  @JoinColumn()
  @Field(_type => Row)
  row: Lazy<Row>;
}
