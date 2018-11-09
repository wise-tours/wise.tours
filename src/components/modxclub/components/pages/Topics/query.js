
import React from "react";

import gql from "graphql-tag";

import { graphql, compose } from "react-apollo";


import {
  TopicNoNestingFragment,
  VoteNoNestingFragment,
} from "../../../../../schema/generated/api.fragments";


export const topicFragment = `
  fragment topicFragment on Topic{
    ...TopicNoNesting
    CreatedBy{
      ...TopicUserNoNesting
    }
    Comments(
      orderBy: id_ASC
    ){
      id
      createdAt
      parent
      text @include(if:$getCommentsText)
      CreatedBy{
        ...TopicUserNoNesting
      }
    }
    Blog{
      id
      name
      longtitle
      uri
    }
    Thread{
      id
      rating
      Votes{
        ...VoteNoNesting
      }
    }
    Tags{
      id
      name
    }
  }


  fragment TopicUserNoNesting on User {
    id
    username
    fullname
    image
  }
  

  ${TopicNoNestingFragment}
  ${VoteNoNestingFragment}
`


export const topicsListFragment = `
  fragment topicsListFragment on Topic{
    ...topicFragment
  }

  ${topicFragment}
`;


export const topicsFullFragment = `
  fragment topicsFullFragment on Topic{
    ...topicFragment
    content
  }

  ${topicFragment}
`;


export const topicsConnectionQuery = gql`

  query topicsConnection(
    $first:Int!
    $skip:Int
    $where: TopicWhereInput
    $orderBy: TopicOrderByInput!
    $getCommentsText:Boolean = false
  ){
    objectsConnection: topicsConnection(
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
          ...topicsListFragment
        }
      }
    }
  }

  ${topicsListFragment}

`;


export const topicQuery = gql`

  query topic(
    $where: TopicWhereUniqueInput!
    $getCommentsText:Boolean = true
  ){
    object: topic(
      where: $where
    ){ 
      ...topicsFullFragment
    }
  }

  ${topicsFullFragment}

`;


export const createTopicProcessor = gql`
 

  mutation createTopicProcessor(
    $data:TopicCreateInput!
    $getCommentsText:Boolean = true
  ){
    response: createTopicProcessor(
      data: $data
    ){
      success
      message
      errors{
        key
        message
      }
      data{
        ...topicsFullFragment
      }
    }
  }

  ${topicsFullFragment}

`;


export const updateTopicProcessor = gql`
 

  mutation updateTopicProcessor(
    $data: TopicUpdateInput!
    $where: TopicWhereUniqueInput!
    $getCommentsText:Boolean = true
  ){
    response: updateTopicProcessor(
      data: $data
      where: $where
    ){
      success
      message
      errors{
        key
        message
      }
      data{
        ...topicsFullFragment
      }
    }
  }

  ${topicsFullFragment}

`;




const TopicsQuery = graphql(topicsConnectionQuery);

export const TopicsConnector = TopicsQuery(props => {

  const {
    View,
    ...other
  } = props;

  return <View
    {...other}
  />;
});


const TopicQuery = compose(graphql(topicQuery), graphql(updateTopicProcessor));


export const TopicConnector = TopicQuery(props => {

  const {
    View,
    ...other
  } = props;

  return <View
    {...other}
  />;
});


