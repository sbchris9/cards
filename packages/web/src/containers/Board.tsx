import React from 'react';
import { makeStyles, Theme } from '@material-ui/core';
import { Droppable } from 'react-beautiful-dnd';
import { IBoard } from '@ww/common';
import { Row } from './Row';
import { EditDrawer } from '../components/EditDrawer';
import { ROW } from '../config/constants';
import { EditCardDialog } from '../components/EditCardDialog';
import { useStoreState } from '../hooks';

interface sProps {
  isReordering?: boolean;
}
const useStyles = makeStyles((theme: Theme) => ({
  body: ({ isReordering }: sProps) => ({
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: isReordering ? 'flex-start' : 'center',
    margin: isReordering ? 0 : 'auto',
    overflow: 'auto',
    alignItems: isReordering ? 'flex-start' : 'stretch',
    padding: theme.spacing(1, 3 * Number(isReordering)),
    paddingRight: 0
  }),
  sideBar: ({ isReordering }: sProps) => ({
    display: isReordering ? 'flex' : 'none'
  })
}));

export interface Board extends IBoard {
  rows: Row[];
}
interface Props extends Board {}

export const Board: React.FC<Props> = ({ id, rows }) => {
  const { mode, search } = useStoreState(state => state.board);
  const isReordering = mode !== 'NORMAL';
  const isEditing = mode === 'EDITING';
  const classes = useStyles({ isReordering });
  const s = search.toLowerCase();
  const filteredRows = rows
    .map(row => ({
      ...row,
      cards: row.cards.filter(
        card =>
          card.title?.toLowerCase().includes(s) ||
          card.content?.toLowerCase().includes(s)
      )
    }))
    .filter(row => row.cards.length);

  const displayRows = isReordering ? rows : filteredRows;

  return (
    <>
      {isEditing && <EditCardDialog />}
      <EditDrawer open={isReordering} />
      <Droppable droppableId={id} type={ROW}>
        {({ droppableProps, innerRef, placeholder }) => (
          <div ref={innerRef} className={classes.body} {...droppableProps}>
            {displayRows.map((row, i) => (
              <Row id={row.id} key={row.id} cards={row.cards} index={i} />
            ))}
            {placeholder}
          </div>
        )}
      </Droppable>
    </>
  );
};
