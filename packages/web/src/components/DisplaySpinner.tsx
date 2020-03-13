import React from 'react';
import { Box, CircularProgress } from '@material-ui/core';

export const DisplaySpinner = () => (
  <Box
    display="flex"
    height="100%"
    width="100%"
    alignItems="center"
    justifyContent="center"
  >
    <CircularProgress color="primary" />
  </Box>
);
