import { MutationUpdaterFn, gql } from 'apollo-boost';
import {
  CreateRowMutation,
  MyBoardsQuery,
  MyBoardsDocument,
  RemoveRowMutation,
  UpdateRowMutation,
  CreateCardMutation,
  RemoveCardMutation,
  UpdateCardMutation
} from '../generated/graphql';
import { Row } from '../containers/Row';
import { Card } from '../containers/Card';

export const updateOnCreateRow: MutationUpdaterFn<CreateRowMutation> = (
  cache,
  { data }
) => {
  if (!data) return;
  const createdRow = data.createRow;
  const storeResult = cache.readQuery<MyBoardsQuery>({
    query: gql`
      ${MyBoardsDocument}
    `
  });
  const updatedBoards: MyBoardsQuery = { ...storeResult! };
  const updatedRows = [...updatedBoards.myBoards[0].rows];
  const newRow: Row = { ...createdRow, cards: [] };
  updatedRows.splice(createdRow.position, 0, newRow);
  updatedBoards.myBoards[0].rows = updatedRows;

  cache.writeQuery({
    query: gql`
      ${MyBoardsDocument}
    `,
    data: updatedBoards
  });
};

export const updateOnRemoveRow: MutationUpdaterFn<RemoveRowMutation> = (
  cache,
  { data }
) => {
  if (!data) return;
  const removedRow = data.removeRow;
  const storeResult = cache.readQuery<MyBoardsQuery>({
    query: gql`
      ${MyBoardsDocument}
    `
  });
  const updatedBoards: MyBoardsQuery = { ...storeResult! };
  const updatedRows = updatedBoards.myBoards[0].rows.filter(
    row => row.id !== removedRow.id
  );

  updatedBoards.myBoards[0].rows = updatedRows;
  cache.writeQuery({
    query: gql`
      ${MyBoardsDocument}
    `,
    data: updatedBoards
  });
};

export const updateOnUpdateRow: MutationUpdaterFn<UpdateRowMutation> = (
  cache,
  { data }
) => {
  if (!data) return;
  const updatedRow = data.updateRow;
  const storeResult = cache.readQuery<MyBoardsQuery>({
    query: gql`
      ${MyBoardsDocument}
    `
  });
  const updatedBoards: MyBoardsQuery = { ...storeResult! };
  const currentRows = updatedBoards.myBoards[0].rows as Row[];
  const newRow: Row = {
    ...updatedRow,
    cards: [...currentRows.find(row => row.id === updatedRow.id)!.cards]
  };
  const updatedRows = currentRows.filter(row => row.id !== updatedRow.id);
  updatedRows.splice(updatedRow.position, 0, newRow);

  updatedBoards.myBoards[0].rows = updatedRows;
  cache.writeQuery({
    query: gql`
      ${MyBoardsDocument}
    `,
    data: updatedBoards
  });
};

export const updateOnCreateCard: MutationUpdaterFn<CreateCardMutation> = (
  cache,
  { data }
) => {
  if (!data) return;
  const card = { ...data.createCard, content: '', title: '' };
  const storeResult = cache.readQuery<MyBoardsQuery>({
    query: gql`
      ${MyBoardsDocument}
    `
  });
  const updatedBoards: MyBoardsQuery = { ...storeResult! };
  const rows = updatedBoards.myBoards[0].rows;
  const rowIndex = rows.findIndex(row => row.id === card.row.id);

  updatedBoards.myBoards[0].rows[rowIndex].cards.splice(card.position, 0, card);

  cache.writeQuery({
    query: gql`
      ${MyBoardsDocument}
    `,
    data: updatedBoards
  });
};

export const updateOnRemoveCard: MutationUpdaterFn<RemoveCardMutation> = (
  cache,
  { data }
) => {
  if (!data) return;
  const card = data.removeCard;
  const storeResult = cache.readQuery<MyBoardsQuery>({
    query: gql`
      ${MyBoardsDocument}
    `
  });
  const updatedBoards: MyBoardsQuery = { ...storeResult! };
  const rows = updatedBoards.myBoards[0].rows;
  const rowIndex = rows.findIndex(row => row.id === card.row.id);

  updatedBoards.myBoards[0].rows[
    rowIndex
  ].cards = updatedBoards.myBoards[0].rows[rowIndex].cards.filter(
    c => c.id !== card.id
  ); // REVIEW refactor

  cache.writeQuery({
    query: gql`
      ${MyBoardsDocument}
    `,
    data: updatedBoards
  });
};

export const updateOnUpdateCard: MutationUpdaterFn<UpdateCardMutation> = (
  cache,
  { data }
) => {
  if (!data) return;
  const card = data.updateCard;
  const storeResult = cache.readQuery<MyBoardsQuery>({
    query: gql`
      ${MyBoardsDocument}
    `
  });
  const updatedBoards: MyBoardsQuery = { ...storeResult! };
  const rows = updatedBoards.myBoards[0].rows;
  const rowIndex = rows.findIndex(row => row.id === card.row.id);

  updatedBoards.myBoards[0].rows.forEach(
    row => (row.cards = row.cards.filter(c => c.id !== card.id))
  ); // REVIEW refactor

  updatedBoards.myBoards[0].rows[rowIndex].cards.splice(card.position, 0, card);

  cache.writeQuery({
    query: gql`
      ${MyBoardsDocument}
    `,
    data: updatedBoards
  });
};
