import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { graphql, compose } from 'react-apollo';
// import gql from 'graphql-tag';

import View from './View';

import {
  // user,
  updateUserProcessor,
} from '@modxclub/query';

import Page from '../../layout';
import gql from 'graphql-tag';
import PrismaCmsConnector from '@prisma-cms/connector';

import PageNotFound from "../../404";

export class UserPage extends Page {


  static propTypes = {
    ...Page.propTypes,
    View: PropTypes.func.isRequired,
  }


  static defaultProps = {
    ...Page.defaultProps,
    View,
  }



  setPageMeta(meta = {}) {

    const {
      data: {
        object,
      },
    } = this.props;

    if (!object) {
      return;
    }

    return super.setPageMeta(meta);
  }


  render() {

    const {
      View,
      data,
      ...other
    } = this.props;

    const {
      object,
      loading,
    } = data;

    if (!object) {
      if (loading) {
        return null;
      }
      else {
        return <PageNotFound
          title="Пользователь не найден"
        />
      }
    }

    return super.render(<View
      data={data}
      {...other}
    />)
  }
}


export default class UserPageConnector extends PrismaCmsConnector {

  prepareQuery() {

    const {
      getQueryFragment,
    } = this.props;

    const UserNoNestingFragment = getQueryFragment("UserNoNestingFragment");

    // console.log("UserNoNestingFragment", UserNoNestingFragment);


    const user = gql`
      query user(
        $where:UserWhereUniqueInput!
      ){ 
        object:user(
          where:$where
        ){
          ...UserNoNesting
        } 
      }

      ${UserNoNestingFragment}
    `;

    return compose(
      graphql(user, {
      }),
      graphql(updateUserProcessor, {
      }),
    )(UserPage)
  }

}
