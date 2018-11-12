import React, { Component } from 'react';
import PropTypes from 'prop-types';


import EditableView from 'apollo-cms/lib/DataView/Object/Editable';

import Forum from "../../../../view/forum"

class BlogView extends EditableView {


  canEdit() {

    const {
      user: currentUser,
    } = this.context;

    const {
      id: currentUserId,
      sudo,
    } = currentUser || {};


    const {
      id,
    } = this.getObjectWithMutations() || {};

    return !id || sudo === true;

  }



  getTitle() {

    const object = this.getObjectWithMutations();

    const {
      name,
    } = object || {};

    return name && `Топики в блоге "${name}"` || null;

  }


  renderDefaultView() {


    const {
      where,
      ...other
    } = this.props;


    // const {
    //   data: {
    //     object: blog,
    //     loading,
    //   },
    // } = this.props;


    const {
      id: blogId,
    } = this.getObjectWithMutations();


    let forum = null;

    if (blogId) {
      forum = <Forum
        where={{
          Blog: {
            id: blogId,
          },
        }}
        {...other}
      />
    }

    return forum

  }

  renderEditableView() {

    return this.renderDefaultView();
  }


}


export default BlogView;