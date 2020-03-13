import { User } from './entity/User';

import { sign as signT, verify as verifyT } from 'jsonwebtoken';

const accessTokenExpiresIn = '10s'; //15m
const refreshTokenExpiresIn = '1d'; //7d

type TokenSecretTypes = 'ACCESS' | 'REFRESH';
interface VerifiedAuthToken {
  userId: string;
}

function createTokenHandler(tokenType: TokenSecretTypes) {
  const SECRET = process.env[`${tokenType}_TOKEN_SECRET`]!;

  return {
    sign: (payload: string | object) =>
      signT(payload, SECRET, {
        expiresIn:
          tokenType === 'ACCESS' ? accessTokenExpiresIn : refreshTokenExpiresIn,
        algorithm: 'HS256'
      }),

    verify: (token: string): VerifiedAuthToken =>
      verifyT(token, SECRET, {
        algorithms: ['HS256']
      }) as any
  };
}

export const createAccessToken = (user: User) =>
  createTokenHandler('ACCESS').sign({ userId: user.id });

export const createRefreshToken = (user: User) =>
  createTokenHandler('REFRESH').sign({
    userId: user.id,
    tokenVersion: user.tokenVersion
  });

export const verifyAccessToken = (token: string) =>
  createTokenHandler('ACCESS').verify(token);

export const verifyRefreshToken = (token: string) =>
  createTokenHandler('REFRESH').verify(token);
