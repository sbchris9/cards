import { Action, action } from 'easy-peasy';

export interface AuthModel {
  accessToken?: string;
  setAccessToken: Action<AuthModel, string>;
}

export const auth: AuthModel = {
  accessToken: '',
  setAccessToken: action((state, payload) => {
    state.accessToken = payload;
  })
};
