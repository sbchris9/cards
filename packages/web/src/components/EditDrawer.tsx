import React from 'react';
import clsx from 'clsx';
import {
  makeStyles,
  Theme,
  createStyles,
  useTheme
} from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import DoneIcon from '@material-ui/icons/Done';
import DeleteIcon from '@material-ui/icons/Delete';
import Fab from '@material-ui/core/Fab';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { Box, Paper, Divider, useMediaQuery } from '@material-ui/core';
import { Card, CardBase } from '../containers/Card';
import { getDraggableAnimationStyle } from '../utils/animation';
import {
  CREATE_ROW,
  ROW,
  NEW_ROW,
  CARD,
  NEW_CARD,
  CREATE_CARD,
  DELETE_ROW,
  DELETE_CARD
} from '../config/constants';
import { useStoreActions } from '../hooks';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    drawer: {
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      height: '100%',
      overflow: 'auto'
    },
    divider: {
      marginTop: theme.spacing(1)
    },
    newRowHolder: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing(1, 0),
      position: 'relative',
      width: theme.spacing(4) + Number(theme.card.width),
      height: theme.spacing(2) + Number(theme.card.height)
    },
    newRowHandle: {
      position: 'absolute',
      left: 0,
      top: theme.spacing(1),
      background: theme.palette.secondary.main,
      height: theme.card.height,
      width: theme.spacing(4),
      borderRadius: '3px 0 0 3px',
      boxShadow: theme.card.shadow,
      flex: '0 0 auto'
    },
    newRow: {
      position: 'absolute',
      right: 0,
      top: theme.spacing(1),
      height: theme.card.height,
      width: theme.card.width,
      border: `1px dotted ${theme.palette.grey[400]}`,
      background: theme.palette.background.paper,
      borderLeft: 'none',
      flex: '0 0 auto',
      zIndex: -1
    },
    creator: {
      [theme.breakpoints.down('sm')]: {
        opacity: 0,
        position: 'absolute',
        right: 0
      }
    },
    visible: {
      opacity: 1
    },
    creatorMobile: {
      width: 50,
      height: 50,
      color: 'white',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      [theme.breakpoints.up('md')]: {
        display: 'none'
      }
    },
    deleter: {
      flex: '1 0 auto',
      display: 'flex',
      maxWidth: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      color: theme.palette.grey[500],
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0
    },
    deleterActive: {
      background: theme.palette.error.main,
      color: theme.palette.error.contrastText,
      zIndex: 2,
      overflow: 'hidden'
    },
    hidden: {
      display: 'none'
    }
  })
);

//
// ─── NEW ROW ────────────────────────────────────────────────────────────────────
//

const NewRow: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.newRowHolder}>
      <div className={classes.newRowHandle} />
      <div className={classes.newRow} />
      <AddIcon fontSize="large" color="disabled" />
    </div>
  );
};

//
// ─── ROW CREATOR ────────────────────────────────────────────────────────────────
//

const RowCreator: React.FC = () => {
  const classes = useStyles();
  const theme = useTheme();
  const breakpoint = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Droppable droppableId={CREATE_ROW} type={ROW} isDropDisabled={true}>
      {({ droppableProps, innerRef }, { draggingFromThisWith }) => (
        <div
          ref={innerRef}
          {...droppableProps}
          className={clsx(
            classes.creator,
            draggingFromThisWith && classes.visible
          )}
        >
          <Draggable draggableId={NEW_ROW} index={0}>
            {({ dragHandleProps, draggableProps, innerRef }, snapshot) => (
              <div
                ref={innerRef}
                {...draggableProps}
                {...dragHandleProps}
                style={getDraggableAnimationStyle(
                  draggableProps.style,
                  snapshot
                )}
              >
                <NewRow />
              </div>
            )}
          </Draggable>
          {draggingFromThisWith && !breakpoint && <NewRow />}
        </div>
      )}
    </Droppable>
  );
};

//
// ─── CARD CREATOR ───────────────────────────────────────────────────────────────
//
const CardCreator: React.FC = () => {
  const classes = useStyles();
  const theme = useTheme();
  const breakpoint = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Droppable droppableId={CREATE_CARD} type={CARD} isDropDisabled={true}>
      {({ droppableProps, innerRef }, { draggingFromThisWith }) => (
        <div
          ref={innerRef}
          {...droppableProps}
          className={clsx(
            classes.creator,
            draggingFromThisWith && classes.visible
          )}
        >
          <div>
            <Card
              id={NEW_CARD}
              index={0}
              darkened={false}
              title=" "
              content={<AddIcon color="disabled" fontSize="large" />}
            />
          </div>
          <div>
            {draggingFromThisWith && !breakpoint && (
              <CardBase
                title=" "
                content={<AddIcon color="disabled" fontSize="large" />}
              />
            )}
          </div>
        </div>
      )}
    </Droppable>
  );
};

//
// ─── ROW DELETER ────────────────────────────────────────────────────────────────
//
const RowDeleter: React.FC = () => {
  const classes = useStyles();

  return (
    <Droppable droppableId={DELETE_ROW} type={ROW}>
      {({ droppableProps, innerRef }, { isDraggingOver }) => (
        <div
          {...droppableProps}
          ref={innerRef}
          className={clsx(
            classes.deleter,
            isDraggingOver && classes.deleterActive
          )}
        >
          <DeleteIcon
            fontSize="large"
            color={isDraggingOver ? 'inherit' : 'disabled'}
          />
        </div>
      )}
    </Droppable>
  );
};
//
// ─── CARD DELETER ───────────────────────────────────────────────────────────────
//
const CardDeleter: React.FC = () => {
  const classes = useStyles();

  return (
    <Droppable droppableId={DELETE_CARD} type={CARD}>
      {({ droppableProps, innerRef }, { isDraggingOver }) => (
        <div
          {...droppableProps}
          ref={innerRef}
          className={clsx(
            classes.deleter,
            isDraggingOver && classes.deleterActive
          )}
        >
          <DeleteIcon
            fontSize="large"
            color={isDraggingOver ? 'inherit' : 'disabled'}
          />
        </div>
      )}
    </Droppable>
  );
};

const DrawerDevider: React.FC = () => (
  <div>
    <Divider />
  </div>
);

//
// ─── DRAWER ─────────────────────────────────────────────────────────────────────
//
interface Props {
  open?: boolean;
}
export const EditDrawer = React.memo(({ open }: Props) => {
  const setBoardMode = useStoreActions(actions => actions.board.setBoardMode);
  const classes = useStyles();

  function doneEditing() {
    setBoardMode('NORMAL');
  }

  return (
    <Paper className={clsx(classes.drawer, !open && classes.hidden)}>
      <Box px={3} py={1} zIndex={3}>
        <Box position="relative">
          <RowCreator />
          <Box
            className={classes.creatorMobile}
            bgcolor="secondary.main"
            my={1}
          >
            <AddIcon color="inherit" fontSize="large" />
          </Box>
        </Box>
        <Box py={1} display="flex" justifyContent="center" position="relative">
          <CardCreator />
          <Box className={classes.creatorMobile} bgcolor="primary.main">
            <AddIcon color="inherit" fontSize="large" />
          </Box>
        </Box>
      </Box>

      <DrawerDevider />

      <Box
        display="flex"
        flexDirection="column"
        flex="1 0 100px"
        position="relative"
      >
        <CardDeleter />
        <RowDeleter />
      </Box>

      <DrawerDevider />

      <Box py={4} display="flex" alignItems="center" justifyContent="center">
        <Fab color="primary" onClick={doneEditing}>
          <DoneIcon />
        </Fab>
      </Box>
    </Paper>
  );
});
