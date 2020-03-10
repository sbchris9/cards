import React from 'react';
import { Snackbar } from '@material-ui/core';

import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

interface Props {
  open?: boolean;
  message?: string;
}
export const ErrorMessage: React.FC<Props> = ({ open = false, message }) => (
  <Snackbar
    open={open}
    autoHideDuration={6000}
    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
  >
    <Alert severity="error">{message}</Alert>
  </Snackbar>
);
