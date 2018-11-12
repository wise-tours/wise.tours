
import React from 'react'
import PropTypes from 'prop-types'

import Page from "../layout";

import View from './View';


import PrismaCmsUsersPage from '@prisma-cms/front/lib/modules/pages/UsersPage';


export class UsersPage extends PrismaCmsUsersPage {


  static defaultProps = {
    ...PrismaCmsUsersPage.defaultProps,
    View,
  }


  setPageMeta(meta = {}) {

    return super.setPageMeta({
      title: "Users",
    });

  }

}


export default class extends Page {

  render() {

    return super.render(<UsersPage
      orderBy="createdAt_ASC"
      {...this.props}
    />);

  }

}

