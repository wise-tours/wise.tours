import React, { Component } from 'react'

import { graphql } from 'react-apollo';

import Context from "@prisma-cms/context";

import { TopicPage } from '../';

import {
  createTopicProcessor,
} from "../../query";

export class TopicCreatePage extends TopicPage {




  setPageMeta(meta) {

    return super.setPageMeta({
      title: "Добавить топик",
    });
  }


  onSave = (result) => {



    if (result && result.data) {

      const {
        history,
      } = this.props;


      const {
        location,
      } = history;

      const {
        response: {
          data: object,
        },
      } = result.data || {}

      const {
        uri,
      } = object || {};

      if (uri && location.pathname !== uri) {

        history.replace(uri);
      }

    }

  }

}




export class CreatePage extends Component {


  static contextType = Context;

  render() {

    const {
      user: currentUser,
      uri,
    } = this.context;


    const {
      blogID,
    } = uri.query(true);


    return <TopicCreatePage
      {...this.props}
      data={{
        object: {
          CreatedBy: currentUser,
        },
      }}
      _dirty={{
        name: "",
        topic_tags: [],
        content: [],
        blogID,
      }}
    />;

  }
}

export default graphql(createTopicProcessor)(CreatePage);
