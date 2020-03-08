import { auth, AuthModel } from './authModel';
import { board, BoardModel } from './boardModel';

export interface StoreModel {
  auth: AuthModel;
  board: BoardModel;
}

const model: StoreModel = {
  auth,
  board
};

export default model;
