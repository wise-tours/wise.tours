import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Balances from "./Balances";

import Context from "@prisma-cms/context";

class UserEthWallet extends Component {

  static propTypes = {
    user: PropTypes.object.isRequired,
    currentUser: PropTypes.object,
  };

  static contextType = Context;

  render() {

    const {
      user,
      currentUser,
    } = this.props;


    if (!user) {
      return null;
    }

    const {
      Grid,
    } = this.context;

    const ethAccount = (user.EthAccounts && user.EthAccounts[0]) || null;

    const {
      id: currentUserId,
    } = currentUser || {};


    const {
      id: userId,
    } = user;




    let actions = [];

    let ownWallet;

    if (currentUserId) {

      if (currentUserId === userId) {

      }
      else {

        let currentUserEthAccount = (currentUser.EthAccounts && currentUser.EthAccounts[0]) || null;

        ownWallet = <Balances
          ethAccount={currentUserEthAccount}
          user={currentUser}
        >

        </Balances>

      }

    }


    return <Grid
      container
      spacing={8}
    >

      <Grid
        item
        xs={12}
      // md={6}
      >
        <Balances
          ethAccount={ethAccount}
          user={user}
        >
          {actions}
        </Balances>

      </Grid>

      <Grid
        item
        xs={12}
      // md={6}
      >

        {ownWallet}

      </Grid>



    </Grid>;
  }
}


export default UserEthWallet;