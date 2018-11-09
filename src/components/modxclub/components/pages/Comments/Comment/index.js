import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Page from "../../layout";

import PageNotFound from "../../404";
import { graphql } from 'react-apollo';

import {
  Comment as CommentQuery,
} from "../query";


import {
  updateCommentProcessor,
} from "@modxclub/ui/src/Comments/query.js";

import Comment from "@modxclub/ui/src/Comments/Comment";
import { Typography } from 'material-ui';

import {
  Link,
} from "@modxclub/ui";

const UpdateComment = graphql(updateCommentProcessor)(Comment);

class CommentPage extends Page {

  static propTypes = {
    ...Page.propTypes,
  };


  static defaultProps = {
    ...Page.defaultProps,
  }



  setPageMeta(meta = {}) {

    const {
      data: {
        object: comment,
      },
    } = this.props;


    if (!comment) {
      return;
    }

    const {
      Topic: {
        name,
        longtitle,
      },
    } = comment;

    return super.setPageMeta({
      title: `Комментарий к топику ${longtitle || name}`,
      ...meta,
    });

  }


  render() {

    const {
      data,
      ...other
    } = this.props;

    const {
      object: comment,
      loading,
    } = data;

    if (!comment) {

      if (loading) {
        return null;
      }
      else {
        return <PageNotFound />
      }
    }

    return super.render(
      <div>
        <UpdateComment
          data={data}
          linkType="target"
          {...other}
        />

        <Typography>
          <Link
            to="/comments"
          >
            Вернуться к списку комментариев
          </Link>
        </Typography>
      </div>
    );
  }
}


export default (props) => {

  return <CommentQuery
    View={CommentPage}
    {...props}
  />
};