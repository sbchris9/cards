import React from 'react';
import { EditedCard } from './EditedCard';
import { makeStyles, Theme, createStyles } from '@material-ui/core';
import { useStoreState } from '../hooks';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    editCard: {
      position: 'fixed',
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.6)',
      zIndex: 10
    }
  })
);

export const EditCardDialog: React.FC = () => {
  const classes = useStyles();

  const { x, y } = useStoreState(state => state.board.editedCardPosition);

  return (
    <div className={classes.editCard} aria-labelledby="form-dialog-title">
      <EditedCard x={x} y={y} />
    </div>
  );
};
