import {
  Resolver,
  UseMiddleware,
  Ctx,
  Mutation,
  Arg,
  Int,
  ID,
  InputType,
  Field
} from 'type-graphql';

import { Context } from '../types/Context';
import { auth } from '../middleware/auth';
import { getManager } from 'typeorm';
import { UserInputError, ApolloError } from 'apollo-server-core';
import {
  orderInsert,
  orderRemove,
  orderReposition
} from '../utils/orderUpdatedList';
import { Card } from '../entity/Card';
import { Row } from '../entity/Row';
import { cardSchema } from '@ww/common';

@InputType()
class CardInput implements Partial<Card> {
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  content?: string;

  @Field({ nullable: true })
  rowId?: string;

  @Field(_ => Int, { nullable: true })
  position?: number;
}

@Resolver(_of => Card)
export class CardResolver {
  //
  // ─── CREATE ─────────────────────────────────────────────────────────────────────
  //

  @Mutation(() => Card)
  @UseMiddleware(auth)
  async createCard(
    @Arg('rowId', _ => ID) rowId: string,
    @Arg('cardData') cardData: CardInput,
    @Ctx() { user }: Context
  ) {
    try {
      await cardSchema.validate(cardData);
    } catch (error) {
      throw new UserInputError(error);
    }
    let { position, title, content } = cardData;
    const row = await Row.createQueryBuilder('row')
      .leftJoin('row.board', 'board')
      .leftJoin('board.user', 'user')
      .where('row.id=:rowId', { rowId })
      .andWhere('user.id=:userId', { userId: user!.id })
      .getOne();

    if (!row) throw new UserInputError('Row does not exist');
    try {
      const cards = await Card.createQueryBuilder('card')
        .leftJoin('card.row', 'row')
        .leftJoin('row.board', 'board')
        .leftJoin('board.user', 'user')
        .where('card."rowId"=:rowId', { rowId })
        .andWhere('user.id=:userId', { userId: user!.id })
        .getMany();

      position = Math.min(
        cards.length,
        position !== undefined ? position : Infinity
      );
      const card = Card.create({ position, title, content, row });

      const cardsUpdated = orderInsert(cards, card);
      cardsUpdated.push(card);
      await getManager().transaction(async transactionalEntityManager => {
        await transactionalEntityManager.save(cardsUpdated);
      });
      return card;
    } catch (error) {
      console.log(error);
      throw new UserInputError('Card creation failed.');
    }
  }

  //
  // ─── UPDATE ─────────────────────────────────────────────────────────────────────
  //

  @Mutation(() => Card)
  @UseMiddleware(auth)
  async updateCard(
    @Arg('id', _type => ID) id: string,
    @Arg('cardData') updates: CardInput,
    @Ctx() { user }: Context
  ) {
    try {
      await cardSchema.validate(updates);
    } catch (error) {
      throw new UserInputError(error);
    }
    const card = await Card.createQueryBuilder('card')
      .leftJoin('card.row', 'row')
      .leftJoin('row.board', 'board')
      .leftJoin('board.user', 'user')
      .where('card."id"=:id', { id })
      .andWhere('user.id=:userId', { userId: user!.id })
      .getOne();
    if (!card) throw new UserInputError('Card does not exist');

    try {
      const sourceCards = await Card.createQueryBuilder('card')
        .leftJoin('card.row', 'row')
        .leftJoin('row.board', 'board')
        .leftJoin('board.user', 'user')
        .where('card."rowId"=:rowId', { rowId: (await card.row).id })
        .andWhere('user.id=:userId', { userId: user!.id })
        .getMany();

      const newRowId = updates.rowId;

      const cardsUpdated: Card[] = [];
      if (updates.position !== undefined) {
        if (!newRowId || newRowId === (await card.row).id) {
          cardsUpdated.push(
            ...orderReposition(sourceCards, card, updates.position)
          );
        } else {
          const targetCards = await Card.createQueryBuilder('card')
            .leftJoin('card.row', 'row')
            .leftJoin('row.board', 'board')
            .leftJoin('board.user', 'user')
            .where('card."rowId"=:rowId', {
              rowId: newRowId
            })
            .andWhere('user.id=:userId', { userId: user!.id })
            .getMany();

          const targetRow = await Row.findOne(newRowId);
          if (!targetRow) {
            throw new UserInputError("Target row doesn't exist!");
          }

          card.row = targetRow;
          cardsUpdated.push(...orderRemove(sourceCards, card));
          cardsUpdated.push(...orderInsert(targetCards, card));
        }
        card.position = updates.position;
      }
      updates.title && (card.title = updates.title);
      updates.content && (card.content = updates.content);
      cardsUpdated.push(card);

      await getManager().transaction(async transactionalEntityManager => {
        await transactionalEntityManager.save(cardsUpdated);
      });
      return card;
    } catch (error) {
      console.log(error);
      throw new ApolloError('Card update failed.');
    }
  }

  //
  // ─── REMOVE ─────────────────────────────────────────────────────────────────────
  //

  @Mutation(() => Card)
  @UseMiddleware(auth)
  async removeCard(
    @Arg('id', _type => ID) id: string,
    @Ctx() { user }: Context
  ) {
    const card = await Card.createQueryBuilder('card')
      .leftJoin('card.row', 'row')
      .leftJoin('row.board', 'board')
      .leftJoin('board.user', 'user')
      .where('card."id"=:id', { id })
      .andWhere('user.id=:userId', { userId: user!.id })
      .getOne();
    if (!card) throw new UserInputError('Card does not exist');

    try {
      const cards = await Card.createQueryBuilder('card')
        .leftJoin('card.row', 'row')
        .leftJoin('row.board', 'board')
        .leftJoin('board.user', 'user')
        .where('card."rowId"=:rowId', { rowId: (await card.row).id })
        .andWhere('user.id=:userId', { userId: user!.id })
        .getMany();
      const cardsUpdated = orderRemove(cards, card);

      await getManager().transaction(async transactionalEntityManager => {
        await transactionalEntityManager.save(cardsUpdated);
        await transactionalEntityManager.delete(Card, card.id);
      });
      return card;
    } catch (error) {
      console.log(error);
      throw new UserInputError('Card deletion failed.');
    }
  }
  // ────────────────────────────────────────────────────────────────────────────────
}
