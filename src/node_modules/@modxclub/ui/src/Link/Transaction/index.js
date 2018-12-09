import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import Typography from "material-ui/Typography";


import Link from '../';

import { withStyles } from 'material-ui/styles';

const styles = {
};


export class TransactionLink extends Component {

  render() {

    const {
      object,
      children,
      ...other
    } = this.props;


    if (!object) {
      return null;
    }

    const {
      id,
      address,
    } = object;


    if (!address || !id) {
      return null;
    }

    return <Link
      to={`/eth-transactions/${id}`}
      title={address}
      {...other}
    >
      {children || <Typography
        component="span"
      >
        {address}
      </Typography>}
    </Link>
  }
}


export default withStyles(styles)(TransactionLink);