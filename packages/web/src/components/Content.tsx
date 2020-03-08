import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    content: {
      flexGrow: 1,
      background: "url('/bg.svg')",
      backgroundSize: '50px 30px',
      display: 'flex',
      overflow: 'auto'
    }
  })
);

export const Content: React.FC = ({ children }) => {
  const classes = useStyles();

  return <div className={classes.content}>{children}</div>;
};
