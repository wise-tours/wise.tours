import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import { EditableObjectContext } from '@prisma-cms/front-editor/lib/components/App/context';
import { ObjectContext } from '@prisma-cms/front-editor/lib/components/App/components/public/Connectors/Connector/ListView';
import ResourceField from '..';



class ResourceContent extends ResourceField {


  static defaultProps = {
    ...ResourceField.defaultProps,
    label: undefined,
    helperText: undefined,
    // readOnly: true,
  }

  static Name = "ResourceContent"

  onBeforeDrop = () => {

  }

  canBeDropped = (dragItem) => {
    return false;
  }


  renderPanelView(content) {

    const {
      classes,
    } = this.getEditorContext();

    return super.renderPanelView(content || <div
      className={classes.panelResourceContent}
    >
      ResourceContent
    </div>);
  }


  renderAddButton(content) {

    return super.renderAddButton("Текстовый блок");
  }


  // canBeParent(parent) {

  //   return parent instanceof Section && super.canBeParent(parent);
  // }

  canBeChild(child) {
    return false;
  }


  renderChildren() {

    const {
      Editor,
    } = this.context;

    const {
      content,
    } = this.getComponentProps(this);


    return <EditableObjectContext.Consumer>
      {context => {

        const {
          getEditor,
          updateObject,
          inEditMode,
          getObjectWithMutations,
        } = context;


        if (!getObjectWithMutations) {
          return null;
        }


        const readOnly = !inEditMode;

        const object = getObjectWithMutations();


        if (!object) {
          return null;
        }


        const {
          id: objectId,
        } = object || {};


        return getEditor ? getEditor({
          key: objectId,
          ...this.getComponentProps(this),
          Editor,
          readOnly,
          value: content,
          onChange: value => {

            this.updateComponentProps({
              content: value,
            });

            const {
              components,
            } = getObjectWithMutations();


            updateObject({
              components,
            });

          }
        }) : super.renderChildren();

      }}
    </EditableObjectContext.Consumer>

  }


}

export default ResourceContent;
