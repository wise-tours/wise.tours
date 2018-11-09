
import React from "react";

import {
  CommentNoNestingFragment,
  UserNoNestingFragment,
} from "../../../../../schema/generated/api.fragments";

import gql from "graphql-tag";

import { graphql, compose } from "react-apollo";



export const commentFragment = `
  fragment commentFragment on Comment{
    ...CommentNoNesting

    CreatedBy{
      ...UserNoNesting
    }
    
    parent
    Topic{
      id
      uri
      name
    }
  }
  
  ${CommentNoNestingFragment}
  ${UserNoNestingFragment}
`

export const commentsListFragment = `
  fragment commentsListFragment on Comment{
    ...commentFragment
  }

  ${commentFragment}
`;



export const commentsConnectionQuery = gql`

  query commentsConnection(
    $first:Int!
    $skip:Int
    $where: CommentWhereInput
    $orderBy: CommentOrderByInput!
  ){
    objectsConnection: commentsConnection(
      orderBy: $orderBy
      first: $first
      skip: $skip
      where: $where
    ){
      aggregate{
        count
      }
      edges{
        node{
          ...commentsListFragment
        }
      }
    }
  }

  ${commentsListFragment}

`;

export const commentQuery = gql`

  query comment(
    $where: CommentWhereUniqueInput!
  ){
    object: comment(
      where: $where
    ){ 
      ...commentFragment 
    }
  }

  ${commentFragment}

`;



const CommentsQuery = graphql(commentsConnectionQuery);
export const CommentsConnector = CommentsQuery(props => {

  const {
    View,
    ...other
  } = props;

  return <View
    {...other}
  />;
});



const CommentQuery = graphql(commentQuery);
export const Comment = CommentQuery(props => {

  const {
    View,
    ...other
  } = props;

  return <View
    {...other}
  />;
});

