import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
// import IconButton from 'material-ui/IconButton';

import { Grid } from '@modxclub/ui';

import CreateIcon from 'material-ui-icons/Create';


// import UserItem from "@prisma-cms/front/lib/components/App/Renderer/MainMenu/User";
import {styles as defaultStyles} from "@prisma-cms/front/lib/components/App/Renderer/MainMenu";
import UserItem from "./User";

import { Link } from "react-router-dom";
import { Notices } from '@prisma-cms/society';
import { IconButton } from 'material-ui';

import Context from "@prisma-cms/context";

export const styles = theme => {

  const {
    palette: {
      background: {
        default: backgroundColor,
      },
    },
  } = theme;

  return {
    ...defaultStyles,
    root: {
      // flexGrow: 1,
      backgroundColor,
      position: "relative",
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

  static contextType = Context;

  render() {

    const {
      classes,
      ...other
    } = this.props;


    const {
      user: currentUser,
      logout,
      router: {
        history,
      },
    } = this.context;

    const {
      id: userId,
    } = currentUser || {}

    return (
      <AppBar
        // position="static"
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
              xs={12}
              sm
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
            >
              <Link
                to="/topics"
              >
                <Typography>
                  Топики
                </Typography>
              </Link>

            </Grid>

            <Grid
              item
            >
              <Link
                to="/blogs"
              >
                <Typography>
                  Блоги
                </Typography>
              </Link>

            </Grid>

            <Grid
              item
            >
              <Link
                to="/chat-rooms"
              >
                <Typography
                  component="span"
                  className={classes.link}
                >
                  Чаты
                </Typography>
              </Link>
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
            >
              <Link
                to="/eth-transactions"
              >
                <Typography>
                  Eth
                </Typography>
              </Link>

            </Grid>


            <Grid
              item
              xs
            >
            </Grid>

            {currentUser ?
              <Grid
                key="notifications"
                item
              >
                <Notices
                  key={userId}
                  user={currentUser}
                  classes={{
                    icon: classes.link,
                  }}
                />
              </Grid>
              : null
            }

            <Grid
              key="write"
              item
            >
              <IconButton
                onClick={event => {
                  history.push("/add-topic.html");
                }}
              >
                <CreateIcon />
              </IconButton>

            </Grid>

            {currentUser
              ?
              <Fragment>

                <Grid
                  key="user"
                  item
                >
                  <UserItem
                    key={userId}
                    user={currentUser}
                    classes={classes}
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

export default withStyles(styles)(props => <MainMenu
  {...props}
/>);
