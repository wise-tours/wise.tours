import React, { Component } from 'react';
import PropTypes from 'prop-types';


import EditableView from 'apollo-cms/lib/DataView/Object/Editable';

import Forum from "../../../../view/forum"
import { Typography } from 'material-ui';

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

    // const object = this.getObjectWithMutations();

    // const {
    //   name,
    // } = object || {};

    // return name && `Топики в блоге "${name}"` || null;

    return null;
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
      name,
      type,
    } = this.getObjectWithMutations();


    let forum = null;

    if (blogId) {
      forum = <Forum
        title={name && <Typography
          variant="subheading"
        >
          {`Топики в блоге "${name}"`}
        </Typography> || undefined}
        where={{
          Blog: {
            id: blogId,
          },
        }}
        {...other}
        addObject={type === "Blog" ? () => {
          const {
            router: {
              history,
            },
          } = this.context;
          history.push(`/add-topic.html?blogID=${blogId}`);
        } : undefined}
      />
    }

    return forum

  }

  renderEditableView() {

    return this.renderDefaultView();
  }


}


export default BlogView;