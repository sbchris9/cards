import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {
  Link as RouterLink,
  RouteComponentProps,
  Redirect
} from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { registerSchema } from '@ww/common';
import { formatValidationError, validateToken } from '../utils/other';
import { FormControl, FormHelperText } from '@material-ui/core';
import { useRegisterMutation } from '../generated/graphql';
import { ErrorMessage } from '../components/ErrorMessage';
import { useStoreState } from '../hooks';

const useStyles = makeStyles(theme => ({
  container: {
    margin: 'auto'
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: 'white',
    padding: theme.spacing(4),
    margin: theme.spacing(2)
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(0.5, 0, 2)
  }
}));

type FormData = {
  username: string;
  password: string;
  terms: boolean;
};
export const Register: React.FC<RouteComponentProps> = ({ history }) => {
  const classes = useStyles();
  const [register, { error, data }] = useRegisterMutation();
  const { register: registerField, handleSubmit, errors } = useForm<FormData>({
    validationSchema: registerSchema
  });
  const { accessToken } = useStoreState(state => state.auth);
  const loggedIn = validateToken(accessToken);

  if (loggedIn) return <Redirect to="/" />;

  const onSubmit = handleSubmit(async ({ username, password }) => {
    const success = await register({
      variables: {
        username,
        password
      }
    });

    if (success.data?.register) return history.push('/login');
  });

  return (
    <Container component="main" maxWidth="xs" className={classes.container}>
      <Paper className={classes.paper} square>
        <Avatar className={classes.avatar} color="secondar">
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Register
        </Typography>
        <ErrorMessage open={!!error?.message} message={error?.message} />
        <ErrorMessage
          open={data?.register === false}
          message="Username is already taken."
        />
        <form className={classes.form} noValidate onSubmit={onSubmit}>
          <TextField
            variant="outlined"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            margin="normal"
            autoFocus
            inputRef={registerField}
            error={!!errors.username}
            helperText={formatValidationError(errors.username?.message)}
          />
          <TextField
            variant="outlined"
            required
            fullWidth
            margin="normal"
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            inputRef={registerField}
            error={!!errors.password}
            helperText={formatValidationError(errors.password?.message)}
          />

          <FormControl error={!!errors.terms} component="fieldset">
            <FormControlLabel
              control={
                <Checkbox
                  color="primary"
                  name="terms"
                  inputRef={registerField}
                />
              }
              label="I accept the Terms of Service"
            />
            <FormHelperText>
              {formatValidationError(errors.terms?.message)}
            </FormHelperText>
          </FormControl>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Register
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link component={RouterLink} to="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};
