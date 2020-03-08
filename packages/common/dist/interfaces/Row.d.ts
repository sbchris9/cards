import { ICard } from './Card';
import { Lazy } from '..';
export interface IRow {
    id: string;
    cards: Lazy<ICard[]>;
}
