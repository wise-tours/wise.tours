import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import Typography from "material-ui/Typography";


import Avatar from '../../Avatar';

import Link from '../';

import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';

const styles = {
  root: {
    display: 'inline-flex',
    alignItems: 'center',
    textDecoration: "none",
  },
  row: {
    display: 'inline-flex',
    alignItems: 'center',
    textDecoration: "none",
  },
  avatar: {

    "&.avatar-inline": {
      display: "inline-flex",
      margin: 0,
    },


    "&.avatar-size--small": {
      width: 25,
      height: 25,
      lineHeight: 25,
    },
  },
};


export class UserLink extends Component {

  static propTypes = {
    classes: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    withAvatar: PropTypes.bool.isRequired,
    showName: PropTypes.bool.isRequired,
    size: PropTypes.string.isRequired,
    avatarProps: PropTypes.object,
  }


  static defaultProps = {
    withAvatar: true,
    showName: true,
    size: "normal",
  };


  render() {

    const {
      user,
      variant,
      withAvatar,
      classes,
      secondary,
      showName,
      size,
      avatarProps,
      ...other
    } = this.props;


    if (!user) {
      return null;
    }

    const {
      id,
      username,
      fullname,
      // lastname,
    } = user;

    const name = fullname || username;

    const url = `/profile/${username}/`;
    // const url = `/users/${id}`;


    let avatarLink = <Link
      key={id}
      to={url}
      href={url}
      title={fullname || username}
      {...other}
    >

      <Avatar
        user={user}
        className={[classes.avatar, "avatar-inline", `avatar-size--${size}`].join(" ")}
        {...avatarProps}
      />

    </Link>

    return showName ? (
      <Grid
        container
        className={classes.root}
      >

        <Grid
          item
        >
          {withAvatar && avatarLink || null}

        </Grid>

        <Grid
          item
          xs
        >

          <Link
            key={id}
            to={url}
            href={url}
            style={{
              marginLeft: 5,
            }}
            {...other}
          >

            {variant !== undefined ?
              <Typography
                variant="title"
              >
                {name}
                {this.props.position ? <span style={{ fontSize: '70%', fontStyle: 'italic' }}> - {this.props.position}</span> : null}
              </Typography>
              :
              name
            }

          </Link>

          {secondary}

        </Grid>

      </Grid>
    ) : avatarLink || null;
  }
}


export default withStyles(styles)(UserLink);