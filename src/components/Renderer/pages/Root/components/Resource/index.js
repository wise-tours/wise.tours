import React, { Fragment } from 'react';

import EditorComponent from '@prisma-cms/front-editor/lib/components/App/components/';
import EditableObject from '@prisma-cms/front-editor/lib/components/App/components/public/form/EditableObject';



export class Resource extends EditorComponent {

  static Name = 'Resource';

  static defaultProps = {
    ...EditorComponent.defaultProps,

  }

  renderPanelView(content) {

    const {
      classes,
    } = this.getEditorContext();

    return super.renderPanelView(
      content ||
      <div
        className={classes.panelButton}
      >
        Resource
      </div>
    );
  }


  getRootElement() {

    return super.getRootElement();
  }


  canBeParent(parent) {

    return parent instanceof EditableObject && super.canBeParent(parent);
  }


  canBeChild(child) {

    return super.canBeChild(child);
  }


}

export default Resource;