import React, { useRef } from 'react';
import { createStyles, makeStyles, Theme, lighten } from '@material-ui/core';
import {
  useHandleClickOutside,
  useStoreActions,
  useStoreState
} from '../hooks';
import { useForm } from 'react-hook-form';
import { useMyBoardsQuery, useUpdateCardMutation } from '../generated/graphql';
import { findCardOnBoardQuery } from '../utils/other';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    editedCard: (props: EditedCardProps) => ({
      background: theme.palette.background.paper,
      width: theme.card.width,
      height: theme.card.height,
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      position: 'absolute',
      top: props.y,
      left: props.x,
      [theme.breakpoints.down('xs')]: {
        width: '100%',
        top: 0,
        left: 0
      }
    }),
    titleInput: {
      background: theme.palette.primary.main,
      border: 'none',
      padding: theme.spacing(0, 2),
      color: theme.palette.primary.contrastText,
      height: theme.card.titleHeight,
      fontFamily: theme.typography.fontFamily,
      fontSize: 16,
      textAlign: 'center',
      '&:focus': {
        outline: 'none'
      }
    },
    contentInput: {
      flexGrow: 1,
      resize: 'none',
      width: '100%',
      padding: theme.spacing(1, 2),
      overflowY: 'auto',
      overflowX: 'hidden',
      wordWrap: 'break-word',
      border: 'none',
      background: lighten(theme.palette.primary.main, 0.8),
      '&:focus': {
        outline: 'none',
        background: theme.palette.background.paper
      },

      ...theme.typography.body2,

      lineHeight: '18px'
    }
  })
);

interface EditedCardProps {
  x: number;
  y: number;
}
type CardFormData = {
  title: string;
  content: string;
};
export const EditedCard: React.FC<EditedCardProps> = props => {
  const classes = useStyles(props);
  const setBoardMode = useStoreActions(actions => actions.board.setBoardMode);
  const { editedCardId } = useStoreState(state => state.board);
  const setEditedCardId = useStoreActions(
    actions => actions.board.setEditedCardId
  );

  const el = useRef<HTMLFormElement>(null);

  const { data } = useMyBoardsQuery({ fetchPolicy: 'cache-only' });
  const [updateCard] = useUpdateCardMutation();
  const card = findCardOnBoardQuery(editedCardId, data);

  const { register, handleSubmit, watch } = useForm<CardFormData>({
    defaultValues: {
      content: card?.content,
      title: card?.title
    }
  });

  const makeUpdate = (data: CardFormData) => {
    updateCard({
      variables: {
        id: editedCardId,
        cardData: { title: data.title || ' ', content: data.content || ' ' }
      },
      optimisticResponse: {
        __typename: 'Mutation',
        updateCard: {
          __typename: 'Card',
          id: card?.id,
          content: data.content,
          title: data.title
        } as any
      }
    });
  };
  const exitEditing = () => {
    setEditedCardId('');
    setBoardMode('REORDERING');
  };

  useHandleClickOutside(el, () => {
    makeUpdate({ content: watch('content'), title: watch('title') });
    exitEditing();
  });

  return (
    <form
      className={classes.editedCard}
      ref={el}
      onSubmit={handleSubmit(data => {
        makeUpdate(data);
        exitEditing();
      })}
    >
      <input
        className={classes.titleInput}
        name="title"
        ref={register}
        autoFocus
        type="text"
        spellCheck={false}
        autoComplete="off"
      />
      <textarea
        className={classes.contentInput}
        name="content"
        ref={register}
        spellCheck={false}
      />
    </form>
  );
};
