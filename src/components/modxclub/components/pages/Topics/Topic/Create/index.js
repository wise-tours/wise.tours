import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { graphql, compose } from 'react-apollo';

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

    console.log("onSave", result);

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

        history.replace(`/${uri}`);
      }

    }

  }


  // componentWillMount() {

  //   const {
  //     View,
  //   } = this.props;


  //   const Renderer = compose(
  //     graphql(createTopic, {
  //     }),

  //   )(View);

  //   Object.assign(this.state, {
  //     Renderer,
  //     data: {
  //       object: {},
  //     },
  //   });

  //   super.componentWillMount && super.componentWillMount();

  // }


  // render() {

  //   const {
  //     View,
  //     ...other
  //   } = this.props;


  //   const {
  //     Renderer,
  //     data,
  //   } = this.state;


  //   const {
  //     location: {
  //       search: {
  //         name,
  //         place,
  //         parent,
  //       },
  //     },
  //   } = this.context;


  //   return <Renderer
  //     data={data}
  //     onSave={result => this.onSave(result)}
  //     _dirty={{
  //       name,
  //       parent,
  //       place: place ? {
  //         id: place,
  //       } : undefined,
  //     }}
  //     {...other}
  //   />

  // }

}




export class CreatePage extends Component {


  static contextTypes = {
    user: PropTypes.object,
  }

  render() {

    const {
      user: currentUser,
    } = this.context;


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
      }}
    />;

  }
}

export default graphql(createTopicProcessor)(CreatePage);
