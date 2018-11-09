import React, { Component } from 'react';
import PropTypes from 'prop-types';


// import PrismaCmsComponent from "@prisma-cms/component";


// import gql from "graphql-tag";

// import { graphql } from "react-apollo";

import View from "./view";


import {
  TopicsConnector,
} from "../../pages/Topics/query";


export class ForumConnector extends Component {


  static propTypes = {
    View: PropTypes.func.isRequired,
    first: PropTypes.number.isRequired,
    orderBy: PropTypes.string.isRequired,
    tagName: PropTypes.string,
    where: PropTypes.object.isRequired,
    getCommentsText: PropTypes.bool.isRequired,
  };


  static defaultProps = {
    View,
    first: 12,
    where: {
    },
    orderBy: "createdAt_DESC",
    getCommentsText: false,
  }


  static contextTypes = {
    uri: PropTypes.object.isRequired,
  }


  constructor(props){

    super(props);

    console.log("Forum constructor");

  }


  render() {

    let {
      first,
      tagName,
      where: {
        ...where
      },
      ...other
    } = this.props;

    const {
      uri,
    } = this.context;


    let {
      page,
    } = uri.query(true);

    let skip;

    page = page && parseInt(page) || 0;

    if(first && page > 1){
      skip = (page - 1) * first;
    }


    if(tagName){
      where = {
        ...where,
        tag: tagName,
      }
    }

    return (
      <TopicsConnector
        first={first}
        skip={skip}
        page={page}
        where={where}
        {...other}
      />
    );
  }
}

// export class ForumConnector extends PrismaCmsComponent {


//   static propTypes = {
//     ...PrismaCmsComponent.propTypes,
//     getQueryFragment: PropTypes.func.isRequired,
//     View: PropTypes.func.isRequired,
//     first: PropTypes.number.isRequired,
//     orderBy: PropTypes.string.isRequired,
//   };


//   static defaultProps = {
//     ...PrismaCmsComponent.defaultProps,
//     View,
//     first: 12,
//     // where: {
//     //   id: 796,
//     // },
//     orderBy: "createdAt_DESC",
//   }


//   componentWillMount() {

//     this.prepareQuery();

//     super.componentWillMount && super.componentWillMount()
//   }


//   prepareQuery() {

//     const {
//       View,
//     } = this.props;

//     let query = gql`

//       query topicsConnection(
//         $first:Int!
//         $skip:Int
//         $where: TopicWhereInput
//         $orderBy: TopicOrderByInput!
//       ){
//         objectsConnection: topicsConnection(
//           orderBy: $orderBy
//           first: $first
//           skip: $skip
//           where: $where
//         ){
//           aggregate{
//             count
//           }
//           edges{
//             node{
//               ...topicsConnectionFields
//             }
//           }
//         }
//       }

//       fragment topicsConnectionFields on Topic{
//         id
//         name
//         longtitle
//         uri
//         thread_id
//         createdAt
//         updatedAt
//         CreatedBy{
//           ...TopicUserNoNesting
//         }
//         Comments(
//           orderBy: id_DESC
//         ){
//           id
//           createdAt
//           CreatedBy{
//             ...TopicUserNoNesting
//           }
//         }
//         Blog{
//           id
//           name
//           longtitle
//           uri
//         }
//         Thread{
//           id
//           rating
//           Votes{
//             ...VoteNoNesting
//           }
//         }
//         Tags{
//           id
//           name
//         }
//       }


//       fragment TopicUserNoNesting on User {
//         id
//         username
//         fullname
//         image
//       }

//       fragment VoteNoNesting on Vote {
//         id
//         target_id
//         target_class
//         thread_id
//         user_id
//         direction
//         value
//         createdAt
//       }

//     `;


//     this.Query = graphql(query)(View);

//   }


//   render() {


//     const {
//       Query,
//     } = this;

//     const {
//       ...other
//     } = this.props;

//     return (
//       <Query
//         {...other}
//       />
//     );
//   }
// }


export default ForumConnector;