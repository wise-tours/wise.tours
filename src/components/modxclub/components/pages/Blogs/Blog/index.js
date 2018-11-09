

import React, { Component } from 'react';

import PropTypes from "prop-types";

import Page from '../../layout';



import { BlogConnector } from "../query";

import View from "./View";

export class BlogPage extends Page {


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
        object: blog,
      },
    } = this.props;

    if (!blog) {
      return;
    }

    const {
      name: blogName,
    } = blog;

    return super.setPageMeta({
      title: `Топики в блоге "${blogName}"`,
    });

  }


  render() {

    const {
      data,
      View,
      ...other
    } = this.props;


    const {
      object: blog,
      loading,
    } = data;

    let output = null;


    if (!blog) {

      if (loading) {
        output = null;
      }
      else {
        output = "Не был получен блог";
      }

    }
    else {
      output = <View
        data={data}
        {...other}
      />
    }

    return super.render(output)

  }

}

export default (props) => {

  return <BlogConnector
    View={BlogPage}
    {...props}
  />
};
