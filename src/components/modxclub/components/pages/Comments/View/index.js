import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import CommentsList from "@modxclub/ui/src/Comments/List";

import { Pagination } from '@modxclub/ui';
import { Typography } from 'material-ui';

import { Grid } from "@modxclub/ui"

class CommentsView extends Component {

  static propTypes = {

  };

  render() {


    const {
      page,
    } = this.props;

    // console.log("this.defaultProps", this.defaultProps);

    const {
      objectsConnection,
      loading,
      variables: {
        first: limit,
      },
    } = this.props.data;


    const {
      edges,
      aggregate,
    } = objectsConnection || {};

    const {
      count = 0,
    } = aggregate || {};

    if (!edges || !edges.length) {

      if (loading) {
        return null;
      }
      else {
        return <Typography>
          Данные не были получены
        </Typography>
      }

    }


    let comments = edges.map(n => n.node);


    let content = <Grid
      container
      spacing={0}
    >

      {edges && edges.length ? <Grid
        item
        xs={12}

      >

        <CommentsList
          comments={comments}
          linkType="target"
        />

        <Pagination
          limit={limit}
          total={count}
          page={page || 1}
          style={{
            marginTop: 20,
          }}
        />
      </Grid> : null
      }

    </Grid>


    return (content);
  }
}


export default CommentsView;