import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Link } from 'react-router-dom';

import Typography from "material-ui/Typography";

import { withStyles } from 'material-ui/styles';

export const styles = {
  root: {
  },
  text: {
    display: "inline-block",
  },
};

export class UiLink extends Component {

  static propTypes = {
    className: PropTypes.string,
    textClassName: PropTypes.string,
  }

  render() {

    const {
      className,
      textClassName,
      classes,
      children,
      ...other
    } = this.props;

    return (
      <Link
        className={[classes.root, className].join(" ")}
        {...other}
      >
        <Typography
          component="span"
          className={[classes.text, textClassName].join(" ")}
        >
          {children || ""}
        </Typography>
      </Link>
    )
  }
}


export default withStyles(styles)(UiLink);
