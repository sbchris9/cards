import React from 'react';
import { Typography, Link, Box, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  dot: {}
}));

function Copyright() {
  const classes = useStyles();

  return (
    <Typography variant="body2" color="inherit" align="center">
      {'Copyright © '}
      <Link color="inherit" href="#">
        webapp
      </Link>{' '}
      {new Date().getFullYear()}
      <span className={classes.dot}>{' • '}</span>
      <Link color="inherit" href="#">
        Terms of Service
      </Link>
      {' - '}
      <Link color="inherit" href="#">
        Cookies
      </Link>
      {' - '}
      <Link color="inherit" href="#">
        Privacy Policy
      </Link>
    </Typography>
  );
}

export const Footer: React.FC = () => (
  <Box bgcolor="grey.300" color="grey.600" p={0.5} zIndex={9999}>
    <Copyright />
  </Box>
);
