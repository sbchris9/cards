import { OrderedResource } from '../entity/abstract/OrderedResource';

export function orderInsert<T extends OrderedResource>(list: T[], newItem: T) {
  const updated: T[] = [];
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    if (item.position >= newItem.position) {
      item.position++;
      updated.push(item);
    }
  }
  return updated;
}

export function orderReposition<T extends OrderedResource>(
  list: T[],
  { position: from }: T,
  to: number
) {
  const updated: T[] = [];
  for (let i = 0; i < list.length; i++) {
    const item = list[i];

    if (item.position > from && item.position <= to) {
      item.position--;
      updated.push(item);
    } else if (item.position < from && item.position >= to) {
      item.position++;
      updated.push(item);
    }
  }
  return updated;
}

export function orderRemove<T extends OrderedResource>(
  list: T[],
  { position }: T
) {
  const updated: T[] = [];
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    if (item.position > position) {
      item.position = item.position - 1;
      updated.push(item);
    }
  }
  return updated;
}
