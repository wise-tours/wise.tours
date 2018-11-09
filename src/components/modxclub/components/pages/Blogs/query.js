
import React from "react";

import gql from "graphql-tag";

import { graphql } from "react-apollo";


const blogsListQuery = gql`
  query blogs(
    $where: BlogWhereInput
    $orderBy: BlogOrderByInput
    $skip: Int
    $first: Int!
  ){
    blogsConnection(
      where: $where
      orderBy: $orderBy
      first: $first
      skip: $skip
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

  query blog {
    blog(
      where:{
        # id
        uri: "blog/club/"
      }
    ){
      ...blog
    }
  }



`;


export const blogFieldsFragment = `
  fragment blogFields on Blog{
    id
    name
    longtitle
    alias
    uri
  }
`;



export const blogFragment = `
  fragment blogFragment on Blog{
    ...blogFields
  }
  ${blogFieldsFragment}
`;


export const blogsListFragment = `
  fragment blogsListFragment on Blog{
    ...blogFields
  }
  ${blogFragment}
`;

export const blogFullFragment = `
  fragment blogFullFragment on Blog{
    ...blogFragment
  }
  ${blogFragment}
`;


export const blogsConnectionQuery = gql`

  query blogsConnection(
    $first:Int!
    $skip:Int
    $where: BlogWhereInput
    $orderBy: BlogOrderByInput!
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
    $where: BlogWhereUniqueInput!
  ){
    object: blog(
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

