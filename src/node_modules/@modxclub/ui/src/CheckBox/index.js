import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui';

import GroupIcon from 'material-ui-icons/Group';
import Checkbox from 'material-ui/Checkbox';
import { Typography } from 'material-ui';

const styles = {
  root: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 5,
  },
}

export class CheckBoxWithLabel extends Component {

  static propTypes = {
    classes: PropTypes.object.isRequired,
    checked: PropTypes.bool.isRequired,
    label: PropTypes.string,
  }

  static defaultProps = {
  }

  render() {

    const {
      classes,
      inEditMode,
      children,
      label,
      ...other
    } = this.props;


    let labelView;

    if (label) {
      labelView = <Typography>
        {label}
      </Typography>;
    }
    else {
      labelView = children || null;
    }

    return <div
      className={classes.root}
    >
      <Checkbox
        {...other}
      /> {labelView}
    </div>

  }
}

export default withStyles(styles)(CheckBoxWithLabel);