import { Context } from '../types/Context';
import { MiddlewareFn } from 'type-graphql';
import { User } from '../entity/User';
import { AuthenticationError, UserInputError } from 'apollo-server-core';
import { verifyAccessToken } from '../authTokens';

export const auth: MiddlewareFn<Context> = async ({ context }, next) => {
  const authorization = context.req.headers['authorization'];
  if (!authorization) {
    throw new AuthenticationError('Not authenticated');
  }
  try {
    const token = authorization.split(' ')[1];
    const payload = verifyAccessToken(token);
    const user = await User.findOne(payload.userId);
    if (!user) throw new UserInputError("User doesn't exist");
    context.user = user;
  } catch (error) {
    console.log(error);
    throw new AuthenticationError('Not authenticated');
  }
  return next();
};
