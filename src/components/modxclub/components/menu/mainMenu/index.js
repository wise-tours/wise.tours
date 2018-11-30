import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
// import IconButton from 'material-ui/IconButton';

import { Grid } from '@modxclub/ui';

// import MenuIcon from 'material-ui-icons/Menu';

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
    logout: PropTypes.func.isRequired,
    user: PropTypes.object,
  }

  render() {

    const {
      classes,
      ...other
    } = this.props;


    const {
      user: currentUser,
      logout,
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


          {/* <Button color="inherit">Login</Button> */}

          <Grid
            container
            alignItems="center"
            spacing={8}
          >
            <Grid
              item
            >
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

            </Grid>

            <Grid
              item
              xs
            >
            </Grid>


            <Grid
              item
            >
              <Link
                to="/people"
              >
                <Typography>
                  Участники
                </Typography>
              </Link>

            </Grid>

            <Grid
              item
            >
              <Link
                to="/projects"
              >
                <Typography>
                  Проекты
                </Typography>
              </Link>

            </Grid>

            <Grid
              item
            >
              <Link
                to="/tasks?status_in=New&status_in=Accepted&status_in=Progress&status_in=Paused&status_in=RevisionsRequired&status_in=Discuss&status_in=Approved&status_in=Done"
              >
                <Typography>
                  Задачи
                </Typography>
              </Link>

            </Grid>

            <Grid
              item
            >
              <Link
                to="/timers"
              >
                <Typography>
                  Выполнение
                </Typography>
              </Link>

            </Grid>

            <Grid
              item
            >
              <a
                href="/graphql-voyager"
                rel="noindex,nofollow"
              >
                <Typography>
                  Схема
                </Typography>
              </a>

            </Grid>

            <Grid
              item
            >
              <a
                href="https://api.modxclub.ru"
                rel="noindex,nofollow"
                target="_blank"
              >
                <Typography>
                  API
                </Typography>
              </a>

            </Grid>


            <Grid
              item
              xs
            >
            </Grid>


            {currentUser
              ?
              <Fragment>
                <Grid
                  key="write"
                  item
                >
                  <Link
                    to="/add-topic.html"
                  >
                    <Typography>
                      Создать топик
                    </Typography>
                  </Link>

                </Grid>
                <Grid
                  key="user"
                  item
                >
                  <UserItem
                    key={userId}
                    user={currentUser}
                  />
                </Grid>
                <Grid
                  key="logout"
                  item
                >
                  <a
                    href="javascript:;"
                    onClick={() => logout()}
                  >
                    Выход
                  </a>

                </Grid>
              </Fragment>
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
                    Войти
                  </Typography>
                </Button>

              </Grid>
            }
          </Grid>



          {/* <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
            <MenuIcon />
          </IconButton> */}

        </Toolbar>
      </AppBar >
    );
  }
}

MainMenu.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MainMenu);