import { IRow } from './Row';
import { Lazy } from '..';

export interface IBoard {
  id: string;
  rows: Lazy<IRow[]>;
}
