import React, { useState } from 'react';
import {
  fade,
  makeStyles,
  Theme,
  createStyles
} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import SearchIcon from '@material-ui/icons/Search';
import ExitIcon from '@material-ui/icons/ExitToAppOutlined';
import DeleteIcon from '@material-ui/icons/DeleteForeverOutlined';
import MoreIcon from '@material-ui/icons/MoreVert';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  ListItemIcon,
  ListItemText
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import {
  useLogoutMutation,
  useDeleteAccountMutation,
  useMeQuery
} from '../generated/graphql';
import { useStoreActions, useStoreState } from '../hooks';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    toolBar: {
      padding: theme.spacing(0, 3),
      height: theme.spacing(8),
      display: 'flex',
      alignItems: 'center'
    },
    title: {
      display: 'none',
      flex: '1 9999 0%',
      alignItems: 'center',
      [theme.breakpoints.up('sm')]: {
        display: 'flex'
      }
    },
    logo: {
      height: theme.spacing(3.5),
      verticalAlign: 'middle'
    },
    search: {
      position: 'relative',
      flex: '0 1 auto',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.black, 0.15),
      '&:hover': {
        backgroundColor: fade(theme.palette.common.black, 0.25)
      },
      marginRight: theme.spacing(2),
      marginLeft: 0,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto'
      }
    },
    searchIcon: {
      width: theme.spacing(7),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    inputRoot: {
      color: 'inherit'
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 7),
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: 200
      }
    },
    menuItem: {
      padding: theme.spacing(0, 2),
      height: '100%',
      ...theme.typography.button,
      color: theme.palette.text.primary,
      '&:hover': {
        background: theme.palette.grey[100], // wrrorororor
        cursor: 'pointer'
      },

      '&:hover::after': {
        content: '" "',
        height: theme.spacing(0.5),
        width: '100%',
        background: theme.palette.secondary.main,
        position: 'absolute',
        bottom: 0,
        left: 0
      }
    },
    sectionDesktop: {
      display: 'none',
      flex: '1 0 0%',
      justifyContent: 'flex-end',
      height: '100%',
      [theme.breakpoints.up('md')]: {
        display: 'flex'
      }
    },
    sectionMobile: {
      display: 'flex',
      flex: '1 0 0%',
      justifyContent: 'flex-end',
      [theme.breakpoints.up('md')]: {
        display: 'none'
      }
    },
    deleteAccount: {
      color: theme.palette.error.main,
      borderColor: theme.palette.error.main
    }
  })
);

export const TopBar: React.FC = () => {
  const { data } = useMeQuery({
    fetchPolicy: 'network-only'
  });
  const user = data?.me;
  const [logoutMutation] = useLogoutMutation({
    onCompleted: () => {
      window.location.reload();
    }
  });
  const { setSearch } = useStoreActions(actions => actions.board);
  const { search: searchValue } = useStoreState(state => state.board);
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [
    mobileMoreAnchorEl,
    setMobileMoreAnchorEl
  ] = React.useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const [deleteAccountMutation] = useDeleteAccountMutation();

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const openDeleteDialog = () => {
    setDeleteDialogOpen(true);
  };
  const closeDeleteDialog = () => {
    handleMenuClose();
    setDeleteDialogOpen(false);
  };

  const logout = () => {
    logoutMutation();
    handleMenuClose();
  };

  const deleteAccount = () => {
    deleteAccountMutation().then(() => {
      logout();
    });
  };

  const search = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={logout}>
        <ListItemIcon>
          <ExitIcon />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </MenuItem>

      <MenuItem onClick={openDeleteDialog} className={classes.deleteAccount}>
        <ListItemIcon>
          <DeleteIcon color="error" />
        </ListItemIcon>
        <ListItemText primary="Delete Account" />
      </MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      {user ? (
        <MenuItem onClick={logout}>{user.username}</MenuItem>
      ) : (
        [
          <MenuItem component={Link} to="/login" key={'login'}>
            <p>Login</p>
          </MenuItem>,
          <MenuItem component={Link} to="/register" key={'register'}>
            <p>Register</p>
          </MenuItem>
        ]
      )}
    </Menu>
  );

  const deleteDialog = (
    <Dialog
      open={deleteDialogOpen}
      onClose={closeDeleteDialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{'Deleting Account'}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to delete your account? This action is
          irreversible!
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDeleteDialog} color="primary" autoFocus>
          Cancel
        </Button>
        <Button
          onClick={deleteAccount}
          className={classes.deleteAccount}
          variant="outlined"
        >
          DELETE
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <>
      <AppBar position="static" color="inherit" elevation={1}>
        <div className={classes.toolBar}>
          <div className={classes.title}>
            <Link to="/">
              <img src="/logo.svg" alt="Logo" className={classes.logo} />
            </Link>
          </div>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Filter…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput
              }}
              onChange={search}
              value={searchValue}
              inputProps={{ 'aria-label': 'search' }}
            />
          </div>
          <div className={`${classes.sectionDesktop}`}>
            {user ? (
              <Button className={classes.menuItem} onClick={handleMenuOpen}>
                {user.username}
              </Button>
            ) : (
              <>
                <Button
                  component={Link}
                  to="/login"
                  className={classes.menuItem}
                >
                  Login
                </Button>
                <Button
                  component={Link}
                  to="/register"
                  className={classes.menuItem}
                >
                  Register
                </Button>
              </>
            )}
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </div>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
      {deleteDialog}
    </>
  );
};
