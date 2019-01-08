
import React from "react";

import gql from "graphql-tag";

import { graphql } from "react-apollo";



export const blogFieldsFragment = `
  fragment blogFields on Resource{
    id
    name
    longtitle
    uri
    type
  }
`;



export const blogFragment = `
  fragment blogFragment on Resource{
    ...blogFields
  }
  ${blogFieldsFragment}
`;


export const blogsListFragment = `
  fragment blogsListFragment on Resource{
    ...blogFields
  }
  ${blogFragment}
`;

export const blogFullFragment = `
  fragment blogFullFragment on Resource{
    ...blogFragment
  }
  ${blogFragment}
`;


export const blogsConnectionQuery = gql`

  query blogsConnection(
    $first:Int!
    $skip:Int
    $where: ResourceWhereInput
    $orderBy: ResourceOrderByInput!
  ){
    objectsConnection: blogsConnection(
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
          ...blogsListFragment
        }
      }
    }
  }

  ${blogsListFragment}

`;



export const blogQuery = gql`

  query blog(
    $where: ResourceWhereUniqueInput!
  ){
    object: resource(
      where: $where
    ){ 
      ...blogFullFragment
    }
  }

  ${blogFullFragment}

`;




const BlogsQuery = graphql(blogsConnectionQuery);

export const BlogsConnector = BlogsQuery(props => {

  const {
    View,
    ...other
  } = props;

  return <View
    {...other}
  />;
});


const BlogQuery = graphql(blogQuery);

export const BlogConnector = BlogQuery(props => {

  const {
    View,
    ...other
  } = props;

  return <View
    {...other}
  />;
});

