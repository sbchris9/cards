import {
  Resolver,
  UseMiddleware,
  Ctx,
  Mutation,
  Arg,
  Int,
  ID,
  InputType,
  Field,
  FieldResolver,
  Root
} from 'type-graphql';

import { Context } from '../types/Context';
import { auth } from '../middleware/auth';
import { getManager } from 'typeorm';
import { UserInputError, ApolloError } from 'apollo-server-core';
import {
  orderReposition,
  orderRemove,
  orderInsert
} from '../utils/orderUpdatedList';
import { Row } from '../entity/Row';
import { Board } from '../entity/Board';

@InputType()
class RowInput implements Partial<Row> {
  @Field({ nullable: true })
  color?: string;

  @Field(_ => Int, { nullable: true })
  position?: number;
}

@Resolver(_of => Row)
export class RowResolver {
  @FieldResolver()
  async cards(@Root() row: Row) {
    const cards = await row.cards;
    console.log(cards);
    return cards.sort((a, b) => a.position - b.position);
  }

  //
  // ─── CREATE ─────────────────────────────────────────────────────────────────────
  //

  @Mutation(() => Row)
  @UseMiddleware(auth)
  async createRow(
    @Arg('boardId') boardId: string,
    @Arg('position', _ => Int) position: number,
    @Ctx() { user }: Context
  ) {
    const board = await Board.findOne({ where: { id: boardId, user } });
    if (!board) throw new UserInputError('Board does not exist');
    try {
      const rows = await Row.createQueryBuilder('row')
        .leftJoin('row.board', 'board')
        .leftJoin('board.user', 'user')
        .where('row."boardId"=:boardId', { boardId })
        .andWhere('user.id=:userId', { userId: user!.id })
        .getMany();

      position = Math.min(rows.length, position);
      const row = Row.create({ board, position });

      const rowsUpdated = orderInsert(rows, row);
      rowsUpdated.push(row);

      await getManager().transaction(async transactionalEntityManager => {
        await transactionalEntityManager.save(rowsUpdated);
      });
      return row;
    } catch (error) {
      console.log(error);
      throw new UserInputError('Row could not be created');
    }
  }

  //
  // ─── UPDATE ─────────────────────────────────────────────────────────────────────
  //

  @Mutation(() => Row)
  @UseMiddleware(auth)
  async updateRow(
    @Arg('id', _type => ID) id: string,
    @Arg('rowData') updates: RowInput,
    @Ctx() { user }: Context
  ) {
    const row = await Row.createQueryBuilder('row')
      .leftJoin('row.board', 'board')
      .leftJoin('board.user', 'user')
      .where('row.id=:id', { id })
      .andWhere('user.id=:userId', { userId: user!.id })
      .getOne();

    if (!row) throw new UserInputError('Board does not exist');

    try {
      const rows = await Row.createQueryBuilder('row')
        .leftJoin('row.board', 'board')
        .leftJoin('board.user', 'user')
        .where('row."boardId"=:boardId', { boardId: (await row.board).id })
        .andWhere('user.id=:userId', { userId: user!.id })
        .getMany();

      const newPosition =
        updates.position === undefined ? row.position : updates.position;
      const rowsUpdated = orderReposition(rows, row, newPosition);
      rowsUpdated.push(Object.assign(row, updates));
      await getManager().transaction(async transactionalEntityManager => {
        await transactionalEntityManager.save(rowsUpdated);
      });
      return row;
    } catch (error) {
      console.log(error);
      throw new ApolloError('Row update failed.');
    }
  }

  //
  // ─── REMOVE ─────────────────────────────────────────────────────────────────────
  //

  @Mutation(() => Row)
  @UseMiddleware(auth)
  async removeRow(
    @Arg('id', _type => ID) id: string,
    @Ctx() { user }: Context
  ) {
    const row = await Row.createQueryBuilder('row')
      .leftJoin('row.board', 'board')
      .leftJoin('board.user', 'user')
      .where('row.id=:id', { id })
      .andWhere('user.id=:userId', { userId: user!.id })
      .getOne();

    if (!row) throw new UserInputError('Row does not exist');

    try {
      const rows = await Row.createQueryBuilder('row')
        .leftJoin('row.board', 'board')
        .leftJoin('board.user', 'user')
        .where('row."boardId"=:boardId', { boardId: (await row.board).id })
        .andWhere('user.id=:userId', { userId: user!.id })
        .getMany();

      const rowsUpdated = orderRemove(rows, row);

      await getManager().transaction(async transactionalEntityManager => {
        await transactionalEntityManager.save(rowsUpdated);
        await transactionalEntityManager.delete(Row, row.id);
      });
      return row;
    } catch (error) {
      console.log(error);
      throw new UserInputError('Row deletion failed.');
    }
  }
  // ────────────────────────────────────────────────────────────────────────────────
}
