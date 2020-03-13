import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { IRow } from '@ww/common';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { Card } from './Card';
import { getDraggableAnimationStyle } from '../utils/animation';
import { CARD } from '../config/constants';
import { useStoreState } from '../hooks';

interface sProps {
  empty?: boolean;
  isReordering?: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
  holder: ({ isReordering }: sProps) => ({
    display: 'inline-flex',
    overflow: isReordering ? 'visible' : 'auto',
    padding: theme.spacing(1, 0),
    minHeight: Number(theme.card.height) + theme.spacing(2),
    flexShrink: 0,
    width: isReordering ? 50 : 'auto',
    position: 'relative'
  }),

  body: ({ isReordering, empty }: sProps) => ({
    display: 'flex',
    flexGrow: Number(isReordering),
    margin: isReordering ? 0 : 'auto',
    height: theme.card.height,
    minWidth: theme.card.width,
    position: isReordering ? 'absolute' : 'relative',
    left: isReordering ? theme.spacing(4) : 'auto',
    '&::before': {
      content: '" "',
      position: 'absolute',
      height: '100%',
      width: theme.card.width,
      top: 0,
      left: 0,
      border: empty ? `1px dotted ${theme.palette.grey[400]}` : 'none'
    }
  }),
  handle: ({ isReordering }: sProps) => ({
    height: '100%',
    width: theme.spacing(4),
    borderRadius: '3px 0 0 3px',
    boxShadow: theme.card.shadow,

    background: theme.palette.secondary.main,
    display: isReordering ? 'block' : 'none',
    flexShrink: 0
  })
}));

export interface Row extends IRow {
  cards: Card[];
}
interface Props extends Row {
  index: number;
}
export const Row: React.FC<Props> = React.memo(props => {
  const { cards, id, index } = props;
  const boardMode = useStoreState(state => state.board.mode);
  const isReordering = boardMode !== 'NORMAL';
  const classes = useStyles({
    empty: !cards.length,
    isReordering
  });

  return (
    <Draggable draggableId={id} index={index} isDragDisabled={!isReordering}>
      {({ draggableProps, dragHandleProps, innerRef }, snapshot) => (
        <div
          {...draggableProps}
          ref={innerRef}
          className={classes.holder}
          style={getDraggableAnimationStyle(draggableProps.style, snapshot)}
        >
          <div className={classes.handle} {...dragHandleProps} />
          <Droppable
            droppableId={id}
            direction="horizontal"
            type={CARD}
            isDropDisabled={!isReordering}
          >
            {({ droppableProps, placeholder, innerRef }) => (
              <div className={classes.body} {...droppableProps} ref={innerRef}>
                {cards.map((card, i) => (
                  <Card
                    id={card.id}
                    key={card.id}
                    title={card.title}
                    content={card.content}
                    index={i}
                    darkened={!((i + index) % 2)}
                  />
                ))}
                {placeholder}
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
});
