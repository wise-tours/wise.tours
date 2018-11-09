

import React, { Component } from 'react';

import PropTypes from "prop-types";

import Page from '../../layout';




import View from "./view";

import { TopicConnector as Connector } from "../query";


export class TopicPage extends Page {


  static propTypes = {
    ...Page.propTypes,
    View: PropTypes.func.isRequired,
  }


  static defaultProps = {
    ...Page.defaultProps,
    View,
  }

  setPageMeta(meta = {}) {

    const {
      data: {
        object: topic,
      },
    } = this.props;


    if (!topic) {
      return;
    }

    const {
      name,
      longtitle,
    } = topic;

    return super.setPageMeta({
      title: longtitle || name,
      ...meta,
    });

  }


  render() {

    const {
      View,
      data,
      ...other
    } = this.props;


    const {
      object,
      loading,
    } = data;

    if (!object) {

      if (loading) {
        return null;
      }
      else {
        return "Топик не найден";
      }

    }

    return super.render(<View
      data={data}
      onSave={this.onSave}
      {...other}
    />);


  }

}


const TopicConnector = (props) => {

  const {
    getCommentsText = true,
  } = props;

  return <Connector
    View={TopicPage}
    getCommentsText={getCommentsText}
    {...props}
  />

}

// export default TopicPage;
export default TopicConnector;
