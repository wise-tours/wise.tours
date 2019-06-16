import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import { EditableObjectContext } from '@prisma-cms/front-editor/lib/components/App/context';
// import { ObjectContext } from '@prisma-cms/front-editor/lib/components/App/components/public/Connectors/Connector/ListView';
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



        const object = getObjectWithMutations();


        if (!object) {
          return null;
        }

        const {
          activeItem,
        } = this.getEditorContext();


        const isActive = activeItem === this;

        const readOnly = !inEditMode || !isActive ? true : false;

        {/* console.log("ResourceContent content", JSON.stringify(content, true, 2));
        console.log("ResourceContent isActive", isActive); */}


        {/* const {
          id: objectId,
        } = object || {}; */}


        return getEditor ? getEditor({
          ...this.getComponentProps(this),
          Editor,
          readOnly,
          value: content,
          onChange: isActive ? value => {

            this.updateComponentProps({
              content: value,
            });


            {/* const {
              components,
            } = getObjectWithMutations();


            updateObject({
              components,
            }); */}

          } : undefined
        }) : super.renderChildren();

      }}
    </EditableObjectContext.Consumer>

  }


}

export default ResourceContent;
