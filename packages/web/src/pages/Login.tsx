import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import { Link as RouterLink, RouteComponentProps } from 'react-router-dom';
import { loginSchema } from '@ww/common';
import { useLoginMutation } from '../generated/graphql';
import { useForm } from 'react-hook-form';
import { formatValidationError } from '../utils/other';
import { useStoreActions } from '../hooks';
import { ErrorMessage } from '../components/ErrorMessage';

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
    margin: theme.spacing(3, 0, 2)
  }
}));

type FormData = {
  username: string;
  password: string;
};
export const Login: React.FC<RouteComponentProps> = ({ history }) => {
  const classes = useStyles();
  const [login, { error }] = useLoginMutation();
  const { register, handleSubmit, errors } = useForm<FormData>({
    validationSchema: loginSchema
  });
  const setAccessToken = useStoreActions(
    actions => actions.auth.setAccessToken
  );

  const onSubmit = handleSubmit(async ({ username, password }) => {
    const response = await login({
      variables: {
        username,
        password
      }
    });

    if (response.data) {
      setAccessToken(response.data.login.accessToken);

      history.push('/');
    }
  });

  return (
    <Container component="main" maxWidth="xs" className={classes.container}>
      <Paper className={classes.paper} square>
        <Avatar className={classes.avatar} color="secondary">
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <ErrorMessage message={error?.message} open={!!error?.message} />
        <form className={classes.form} noValidate onSubmit={onSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            inputRef={register}
            error={!!errors.username || !!error}
            helperText={formatValidationError(errors.username?.message)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            inputRef={register}
            error={!!errors.password}
            helperText={formatValidationError(errors.password?.message)}
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Login
          </Button>
          <Grid container>
            <Grid item>
              <Link component={RouterLink} to="/register" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};
