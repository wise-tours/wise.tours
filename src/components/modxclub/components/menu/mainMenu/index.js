import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import Grid from 'material-ui/Grid';


import MenuIcon from 'material-ui-icons/Menu';

import UserItem from "./User";

import { Link } from "react-router-dom";

export const styles = theme => {

  const {
    palette: {
      background: {
        default: backgroundColor,
      },
    },
  } = theme;

  return {
    root: {
      flexGrow: 1,
      backgroundColor,
    },
    flex: {
      flex: 1,
    },
    menuButton: {
      marginLeft: 5,
      // marginRight: -12,
    },
  }
};

export class MainMenu extends Component {

  static contextTypes = {
    openLoginForm: PropTypes.func.isRequired,
    user: PropTypes.object,
  }

  render() {

    const {
      classes,
      ...other
    } = this.props;


    const {
      user: currentUser,
    } = this.context;


    const {
      id: userId,
    } = currentUser || {}

    return (
      <AppBar
        position="static"
        color="default"
        className={classes.root}
      >
        <Toolbar>

          <Typography
            variant="title"
            color="inherit"
            className={classes.flex}
          >
            <Link
              to="/"
            >
              MODXCLUB
            </Link>
          </Typography>

          {/* <Button color="inherit">Login</Button> */}

          <Grid
            container
          >
            <Grid
              item
              xs
            >

            </Grid>

            {currentUser
              ?
              [
                <Grid
                  key="user"
                  item
                >
                  <UserItem
                    key={userId}
                    user={currentUser}
                  />
                </Grid>,
                <Grid
                  key="logout"
                  item
                >
                  {/* <Button
                  onClick={() => this.logout()}
                >
                  Signout
              </Button> */}

                </Grid>
              ]
              :
              <Grid
                key="login"
                item
              >
                <Button
                  onClick={e => {
                    // this.setState({
                    //   opened: true,
                    // });
                    const {
                      openLoginForm,
                    } = this.context;
                    openLoginForm();
                  }}
                >
                  <Typography
                    component="span"
                  >
                    Signin
              </Typography>
                </Button>

              </Grid>
            }
          </Grid>



          {/* <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
            <MenuIcon />
          </IconButton> */}

        </Toolbar>
      </AppBar>
    );
  }
}

MainMenu.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MainMenu);