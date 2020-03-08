import { MyBoardsQuery } from '../generated/graphql';
import { Card } from '../containers/Card';

export function capitalizeFirstLetter(string?: string) {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function formatValidationError(string?: string) {
  if (!string) return '';
  return capitalizeFirstLetter(string) + '!';
}

export function findCardOnBoardQuery(
  id: string,
  data?: MyBoardsQuery
): Card | undefined {
  let card: Card | null = null;
  data?.myBoards[0].rows.forEach(row => {
    row.cards.forEach(c => {
      if (c.id === id) card = c as Card;
    });
  });
  return card || undefined;
}
