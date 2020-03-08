import { Response } from 'express';

export const setRefreshToken = (res: Response, token: string) => {
  res.cookie('gid', token, {
    httpOnly: true,
    path: '/refresh_token'
  });
};
