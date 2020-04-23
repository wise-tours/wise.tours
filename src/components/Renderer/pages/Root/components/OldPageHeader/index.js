import React from 'react';
// import PropTypes from 'prop-types';

import MainMenu from '../../../../../menu/mainMenu';

import EditorComponent from "@prisma-cms/front-editor/lib/components/App/components/";

class OldPageHeader extends EditorComponent {

  static defaultProps = {
    ...EditorComponent.defaultProps,
  }

  static Name = "OldPageHeader"

  renderPanelView() {

    const {
      classes,
    } = this.getEditorContext();

    return super.renderPanelView(<div
      className={classes.panelButton}
    >
      Old Page Header
    </div>);
  }


  // getRootElement() {

  //   return MainMenu;
  // }

  renderChildren() {

    return <MainMenu
      key="OldPageHeader"
    />
  }


}

export default OldPageHeader;
