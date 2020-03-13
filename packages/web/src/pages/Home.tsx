import React, { useEffect } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import Fab from '@material-ui/core/Fab';
import EditIcon from '@material-ui/icons/Edit';
import { makeStyles } from '@material-ui/core';
import { RouteComponentProps } from 'react-router-dom';
import { Board } from '../containers/Board';
import { reorderBoard } from '../utils/reorderBoard';
import { useStoreState, useStoreActions } from '../hooks';
import {
  useCreateRowMutation,
  useRemoveRowMutation,
  useUpdateRowMutation,
  useCreateCardMutation,
  useRemoveCardMutation,
  useUpdateCardMutation,
  useMyBoardsLazyQuery
} from '../generated/graphql';
import {
  updateOnCreateRow,
  updateOnRemoveRow,
  updateOnUpdateRow,
  updateOnCreateCard,
  updateOnRemoveCard,
  updateOnUpdateCard
} from '../utils/storeUpdaters';
import { pauseResponseLink } from '..';
import { DisplaySpinner } from '../components/DisplaySpinner';
import { validateToken } from '../utils/other';

const useStyles = makeStyles({
  fab: {
    position: 'fixed',
    right: 40,
    bottom: 40,
    zIndex: 9999999
  }
});

export const Home: React.FC<RouteComponentProps> = ({ history }) => {
  const classes = useStyles();
  const {
    board: { mode: boardMode },
    auth: { accessToken }
  } = useStoreState(state => state);
  const { setBoardMode } = useStoreActions(actions => actions.board);
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

  const [myBoardsQuery, { loading, data }] = useMyBoardsLazyQuery({
    fetchPolicy: 'network-only'
  });

  useEffect(() => {
    if (!validateToken(accessToken)) return history.push('/login');
  }, [accessToken, history]);

  useEffect(() => {
    myBoardsQuery();
  }, [myBoardsQuery]);

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
    pauseResponseLink.pause();
  }

  function onDragEnd(result: DropResult) {
    pauseResponseLink.resume();
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
        <DisplaySpinner />
      ) : board?.rows ? (
        <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
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
