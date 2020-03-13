import {
  Resolver,
  Query,
  Mutation,
  Arg,
  ObjectType,
  Field,
  Ctx,
  UseMiddleware,
  Int
} from 'type-graphql';
import { User } from '../entity/User';
import { hash, compare } from 'bcryptjs';
import { Context } from '../types/Context';
import { createAccessToken, createRefreshToken } from '../authTokens';
import { auth } from '../middleware/auth';
import { getConnection } from 'typeorm';
import { UserInputError } from 'apollo-server-express';
import { setRefreshToken } from '../utils/setRefreshToken';
import { Board } from '../entity/Board';

@ObjectType()
class LoginResponse {
  @Field(() => User, { nullable: true })
  user?: User;

  @Field()
  accessToken: string;
}

@Resolver(_of => User)
export class UserResolver {
  //
  // REGISTER
  //
  @Mutation(() => Boolean)
  async register(
    @Arg('username') username: string,
    @Arg('password') password: string
  ) {
    const hashedPassword = await hash(password, 12);
    try {
      const user = User.create({
        username,
        password: hashedPassword
      });
      await user.save();
      const board = Board.create({
        user,
        name: 'default-board'
      });
      await board.save();
    } catch (err) {
      console.log(err);
      return false;
    }
    return true;
  }

  //
  // LOGIN
  //
  @Mutation(() => LoginResponse)
  async login(
    @Arg('username') username: string,
    @Arg('password') password: string,
    @Ctx() { res }: Context
  ): Promise<LoginResponse> {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      throw new Error('Could not find user');
    }
    const valid = await compare(password, user.password);
    if (!valid) {
      throw new Error('Bad password');
    }

    // login successfiul

    setRefreshToken(res, createRefreshToken(user));

    return {
      accessToken: createAccessToken(user),
      user
    };
  }

  //
  // LOGOUT
  //

  @Mutation(() => Boolean)
  async logout(@Ctx() { res }: Context): Promise<Boolean> {
    setRefreshToken(res, '');
    return true;
  }

  //
  // DELETE ACCOUNT
  //
  @Mutation(() => Boolean)
  @UseMiddleware(auth)
  async deleteAccount(@Ctx() { user }: Context) {
    try {
      await user!.remove();
    } catch (error) {
      console.log(error);
      return false;
    }
    return true;
  }

  //
  // REVOKE REFRHES TOKEN
  //
  @Mutation(() => Boolean)
  async revokeRefreshTokensForUser(@Arg('userId', () => Int) userId: string) {
    await getConnection()
      .getRepository(User)
      .increment({ id: userId }, 'tokenVersion', 1);

    return true;
  }

  //
  // QUERIES
  //
  @Query(() => Boolean)
  async fail() {
    try {
      await Promise.reject('O M G');
    } catch (error) {
      console.log(error);
      throw new UserInputError('Failed :(');
    }
  }

  @Query(() => String)
  async hello() {
    return new Promise(resolve => {
      setTimeout(() => resolve('Hello, hello, hello!'), 1000);
    });
  }

  @Query(() => User)
  @UseMiddleware(auth)
  async me(@Ctx() { user }: Context) {
    return user;
  }
}
