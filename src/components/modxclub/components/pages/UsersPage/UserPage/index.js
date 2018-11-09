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

export class UserPage extends Page {


  static propTypes = {
    ...Page.propTypes,
    View: PropTypes.func.isRequired,
  }


  static defaultProps = {
    ...Page.defaultProps,
    View,
  }


  // static contextTypes = {
  //   user: PropTypes.object,
  // }


  // saveUser = async (data) => {

  //   const {
  //     updateUserProcessor,
  //   } = this.props;

  //   const {
  //     user: {
  //       user,
  //     },
  //   } = this.props;


  //   if (!user) {
  //     return false;
  //   }

  //   const {
  //     id,
  //   } = user;

  //   const result = await updateUserProcessor({
  //     variables: {
  //       updateUserData: data,
  //       updateUserWhere: {
  //         id,
  //       },
  //     },
  //   })
  //     .then(r => r)
  //     .catch(e => {
  //       console.error(e);
  //     });

  //   console.log("updateUser result", result);

  //   return result;

  // }


  render() {

    const {
      View,
      ...other
    } = this.props;


    return super.render(<View
      // object={user}
      // data={data}
      // saveObject={this.saveUser}
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
