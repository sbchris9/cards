import 'reflect-metadata';
import 'dotenv/config';

import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { buildSchema } from 'type-graphql';
import { createConnection, getConnectionOptions } from 'typeorm';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';

import { User } from './entity/User';
import {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken
} from './authTokens';
import { setRefreshToken } from './utils/setRefreshToken';

export const createApp = async () => {
  const app = express();
  app.use(helmet());
  app.use(
    cors({
      credentials: true,
      origin: process.env.FRONTEND_URI || 'http://localhost:3000'
    })
  );
  app.use(cookieParser());

  app.post('/refresh_token', async (req, res) => {
    const token = req.cookies.gid;
    if (!token) return res.send({ ok: false, accessToken: '' });

    let payload: any = null;
    try {
      payload = verifyRefreshToken(token);
    } catch (error) {
      console.log(error);
      return res.send({ ok: false, accessToken: '' });
    }

    const user = await User.findOne({ id: payload.userId });

    if (!user) {
      return res.send({ ok: false, accessToken: '' });
    }
    if (user.tokenVersion !== payload.tokenVersion) {
      return res.send({ ok: false, accessToken: '' });
    }
    setRefreshToken(res, createRefreshToken(user));
    return res.send({ ok: true, accessToken: createAccessToken(user) });
  });

  await createConnection({
    ...(await getConnectionOptions(process.env.NODE_ENV || 'development')),
    name: 'default'
  });

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [__dirname + '/resolver/**/*.ts']
    }),
    context: ({ req, res }) => ({ req, res }),

    formatError: err => {
      return err;
    }
  });

  apolloServer.applyMiddleware({ app, cors: false });

  return app;
};
