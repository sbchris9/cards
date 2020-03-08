import React, { useEffect } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import Fab from '@material-ui/core/Fab';
import EditIcon from '@material-ui/icons/Edit';
import { makeStyles } from '@material-ui/core';
import { Redirect } from 'react-router-dom';
import { Board } from '../containers/Board';
import { reorderBoard } from '../utils/reorderBoard';
import { useStoreState, useStoreActions } from '../hooks';
import {
  useMyBoardsQuery,
  useCreateRowMutation,
  useRemoveRowMutation,
  useUpdateRowMutation,
  useCreateCardMutation,
  useRemoveCardMutation,
  useUpdateCardMutation
} from '../generated/graphql';
import {
  updateOnCreateRow,
  updateOnRemoveRow,
  updateOnUpdateRow,
  updateOnCreateCard,
  updateOnRemoveCard,
  updateOnUpdateCard
} from '../utils/storeUpdaters';
import { maxHeaderSize } from 'http';
import { pauseResponseLink } from '..';

const useStyles = makeStyles({
  fab: {
    position: 'fixed',
    right: 40,
    bottom: 40,
    zIndex: 9999999
  }
});

interface Props {
  loggedIn?: boolean;
}

export const Home: React.FC<Props> = ({ loggedIn = true }) => {
  const classes = useStyles();
  const boardMode = useStoreState(state => state.board.mode);
  const setBoardMode = useStoreActions(actions => actions.board.setBoardMode);
  const [createRow] = useCreateRowMutation({
    update: updateOnCreateRow
  });
  const [removeRow] = useRemoveRowMutation({
    update: updateOnRemoveRow
  });
  const [updateRow] = useUpdateRowMutation({
    update: updateOnUpdateRow
  });
  const [createCard] = useCreateCardMutation({
    update: updateOnCreateCard
  });
  const [removeCard] = useRemoveCardMutation({
    update: updateOnRemoveCard
  });
  const [updateCard] = useUpdateCardMutation({
    update: updateOnUpdateCard
  });

  const { loading, data, refetch } = useMyBoardsQuery();

  useEffect(() => {
    refetch();
  }, []);

  if (!loggedIn) return <Redirect to="/login" />;

  const board = data?.myBoards[0] as Board;
  const boardMutations = {
    createRow,
    removeRow,
    updateRow,
    createCard,
    removeCard,
    updateCard
  };

  function onDragStart() {
    pauseResponseLink.close();
  }

  function onDragEnd(result: DropResult) {
    pauseResponseLink.open();
    if (!result.destination) return;

    reorderBoard({
      board,
      draggableId: result.draggableId,
      source: result.source,
      destination: result.destination,
      type: result.type,
      mutations: boardMutations
    });
  }

  return (
    <>
      {loading ? (
        'loading...'
      ) : board?.rows ? (
        <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
          <Board id={board.id} rows={board.rows} />
        </DragDropContext>
      ) : (
        'No rows'
      )}
      {boardMode === 'NORMAL' && (
        <Fab
          color="secondary"
          className={classes.fab}
          onClick={() => {
            if (boardMode === 'NORMAL') setBoardMode('REORDERING');
          }}
        >
          <EditIcon />
        </Fab>
      )}
    </>
  );
};
