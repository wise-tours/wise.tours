import React, { Component } from 'react';
import PropTypes from 'prop-types';

// import Comment from "./Comment";

import Typography from 'material-ui/Typography'

import {
  createCommentProcessor,
  updateCommentProcessor,
} from "@modxclub/ui/src/Comments/query.js";

import { graphql } from "react-apollo";


import Comment from "@modxclub/ui/src/Comments/Comment";
const NewComment = graphql(createCommentProcessor)(Comment);
const UpdateComment = graphql(updateCommentProcessor)(Comment);


class TopicComments extends Component {


  static propTypes = {
    topic: PropTypes.object.isRequired,
  };

  render() {


    const {
      topic,
    } = this.props;


    if (!topic) {
      return null;
    }

    const {
      id: topicId,
      Comments,
    } = topic;

    // console.log("topic", topic, Comments);


    let comments = Comments && Comments.map(n => {

      const {
        id,
      } = n;

      return <UpdateComment
        key={id}
        data={{
          object: n,
        }}
      />
    }) || null;

    return <div>

      {comments}

 
      {topicId
        ?
        <NewComment
          key={comments.length + "__new"}
          data={{
            object: {},
          }}
          _dirty={{
            text: [],
            topic_id: topicId,
          }}
        />
        :
        null
      }

    </div>
  }
}


export default TopicComments;