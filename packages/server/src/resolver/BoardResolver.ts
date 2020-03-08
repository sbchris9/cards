import {
  Resolver,
  Query,
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
import { Board } from '../entity/Board';
import { auth } from '../middleware/auth';
import { getManager } from 'typeorm';
import { UserInputError, ApolloError } from 'apollo-server-core';
import {
  orderInsert,
  orderReposition,
  orderRemove
} from '../utils/orderUpdatedList';

@InputType()
class BoardInput implements Partial<Board> {
  @Field()
  name: string;

  @Field(_ => Int, { nullable: true })
  position: number;
}

@Resolver(_of => Board)
export class BoardResolver {
  //
  // ────────────────────────────────────────────────────── I ──────────
  //   :::::: Q U E R I E S : :  :   :    :     :        :          :
  // ────────────────────────────────────────────────────────────────
  //

  @Query(() => [Board])
  @UseMiddleware(auth)
  async myBoards(@Ctx() { user }: Context) {
    return user!.boards;
  }

  @Query(() => Board, { nullable: true })
  @UseMiddleware(auth)
  async getBoard(@Ctx() { user }: Context, @Arg('id') id: string) {
    return Board.findOne({ where: { user: user!, id } });
  }

  @FieldResolver()
  async rows(@Root() board: Board) {
    const rows = await board.rows;
    return rows.sort((a, b) => a.position - b.position);
  }
  //
  // ────────────────────────────────────────────────────────── II ──────────
  //   :::::: M U T A T I O N S : :  :   :    :     :        :          :
  // ────────────────────────────────────────────────────────────────────
  //

  //
  // ─── CREATE ─────────────────────────────────────────────────────────────────────
  //

  @Mutation(() => Board)
  @UseMiddleware(auth)
  async createBoard(
    @Arg('boardData') { position, name }: BoardInput,
    @Ctx() { user }: Context
  ) {
    try {
      const boards = await user!.boards;
      position = Math.min(boards.length);

      const board = Board.create({ position, name, user });

      const boardsUpdated = orderInsert(boards, board);
      boardsUpdated.push(board);
      await getManager().transaction(async transactionalEntityManager => {
        await transactionalEntityManager.save(boardsUpdated);
      });
      return board;
    } catch (error) {
      console.log(error);
      throw new UserInputError('Board with this name already exists');
    }
  }

  //
  // ─── UPDATE ─────────────────────────────────────────────────────────────────────
  //

  @Mutation(() => Board)
  @UseMiddleware(auth)
  async updateBoard(
    @Arg('id', _type => ID) id: string,
    @Arg('boardData') updates: BoardInput,
    @Ctx() { user }: Context
  ) {
    const boards = await user!.boards;
    const board = boards.find(board => board.id === id);
    if (!board) throw new UserInputError('Board does not exist.');
    const newPosition =
      updates.position === undefined ? board.position : updates.position;
    try {
      const boardsUpdated = orderReposition(boards, board, newPosition);
      boardsUpdated.push(Object.assign(board, updates));
      await getManager().transaction(async transactionalEntityManager => {
        await transactionalEntityManager.save(boardsUpdated);
      });
      return board;
    } catch (error) {
      console.log(error);
      throw new ApolloError('Board update failed.');
    }
  }

  //
  // ─── REMOVE ─────────────────────────────────────────────────────────────────────
  //

  @Mutation(() => Board)
  @UseMiddleware(auth)
  async removeBoard(
    @Arg('id', _type => ID) id: string,
    @Ctx() { user }: Context
  ) {
    const boards = await user!.boards;
    const board = boards.find(board => board.id === id);
    if (!board) throw new UserInputError('Board does not exist.');
    try {
      const boardsUpdated = orderRemove(boards, board);

      await getManager().transaction(async transactionalEntityManager => {
        await transactionalEntityManager.save(boardsUpdated);
        await transactionalEntityManager.delete(Board, board.id);
      });
      return board;
    } catch (error) {
      console.log(error);
      throw new UserInputError('Board deletion failed.');
    }
  }
  // ────────────────────────────────────────────────────────────────────────────────
}
