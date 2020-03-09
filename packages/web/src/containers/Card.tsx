import React, { useRef } from 'react';
import { makeStyles, Theme, darken } from '@material-ui/core/styles';
import { Draggable } from 'react-beautiful-dnd';
import { getDraggableAnimationStyle } from '../utils/animation';
import { IconButton } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import { NEW_CARD } from '../config/constants';
import { useStoreState, useStoreActions } from '../hooks';
import { ICard } from '@ww/common';

interface sProps extends BaseProps {} // TODO CLEAN

const useStyles = makeStyles((theme: Theme) => ({
  holder: {
    display: 'inline-block',
    position: 'relative',
    '&:hover .editButton': {
      display: 'inline-block'
    }
  },
  body: ({ textSelectable }: sProps) => ({
    width: theme.card.width,
    height: theme.card.height,
    textAlign: 'center',
    position: 'relative',
    display: 'inline-block',
    flexShrink: 0,
    verticalAlign: 'top',
    userSelect: textSelectable ? 'auto' : 'none'
  }),
  titleHolder: (props: sProps) => ({
    padding: '0 10px',
    background: darken(
      theme.palette.primary.main,
      0.0333 * Number(props.darkened)
    )
  }),
  title: {
    maxHeight: '100%',
    maxWidth: '100%',
    overflow: 'hidden',
    color: 'white',
    height: theme.card.titleHeight,
    fontSize: '16px',
    display: 'flex'
  },
  titleText: {
    margin: 'auto'
  },
  contentHolder: (props: sProps) => ({
    height: theme.card.contentHeight,
    background: darken(
      theme.palette.background.paper,
      0.025 * Number(props.darkened)
    ),
    padding: '10px 16px'
  }),
  content: {
    maxHeight: '100%',
    lineHeight: '18px',
    overflow: 'hidden',
    wordWrap: 'break-word',
    whiteSpace: 'pre-wrap'
  },
  // Shadow,
  cardShadow: props => ({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: -1,
    boxShadow: theme.card.shadow
  }),
  //Button
  editButton: {
    position: 'absolute',
    top: 2,
    right: 2,
    color: theme.palette.primary.contrastText,
    display: 'none'
  }
}));

interface BaseProps {
  title?: string;
  content?: string | JSX.Element;
  darkened?: boolean;
  textSelectable?: boolean;
}

export const CardBase: React.FC<BaseProps> = props => {
  const { darkened = true } = props;
  const classes = useStyles({ ...props, darkened });
  const { title, content } = props;
  return (
    <div className={classes.body}>
      <div className={classes.titleHolder}>
        <div className={classes.title}>
          <span className={classes.titleText}>{title}</span>
        </div>
      </div>
      <div className={classes.contentHolder}>
        <div className={classes.content}>{content}</div>
      </div>
      <div className={classes.cardShadow} />
    </div>
  );
};

export interface Card extends ICard {}

interface Props extends BaseProps {
  id: string;
  index: number;
}
export const Card: React.FC<Props> = React.memo(props => {
  const { id, index } = props;
  const classes = useStyles();
  const { mode: boardMode, creationDisabled } = useStoreState(
    state => state.board
  );
  const enterEditMode = useStoreActions(actions => actions.board.enterEditMode);

  let el = useRef<HTMLDivElement>();

  const isReordering = boardMode !== 'NORMAL';

  const handleEdit = () => {
    enterEditMode({ cardId: id, cardRef: el.current! });
  };

  return (
    <Draggable
      draggableId={id}
      index={index}
      isDragDisabled={!isReordering || !!creationDisabled}
    >
      {({ dragHandleProps, draggableProps, innerRef }, snapshot) => (
        <div
          className={classes.holder}
          {...draggableProps}
          {...dragHandleProps}
          ref={(ref: HTMLDivElement) => {
            innerRef(ref);
            el.current = ref!;
          }}
          style={getDraggableAnimationStyle(draggableProps.style, snapshot)}
        >
          <CardBase {...props} textSelectable={!isReordering} />
          {isReordering && (
            <IconButton
              className={`${classes.editButton} editButton`}
              color="inherit"
              aria-label="Edit Card"
              component="span"
              size="small"
              onClick={handleEdit}
            >
              {id !== NEW_CARD && <EditIcon fontSize="small" />}
            </IconButton>
          )}
        </div>
      )}
    </Draggable>
  );
});
