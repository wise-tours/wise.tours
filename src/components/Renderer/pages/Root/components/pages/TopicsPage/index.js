import React from 'react';

import EditorComponent from '@prisma-cms/front-editor/lib/components/App/components/';
import ForumView from '../../../../../../view/forum/view';
import { ConnectorContext } from '@prisma-cms/front-editor/lib/components/App/components/public/Connectors/Connector';

export class TopicsPage extends EditorComponent {

  static Name = 'TopicsPage';

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
        TopicsPage
      </div>
    );
  }


  getRootElement() {

    return super.getRootElement();
  }


  canBeParent(parent) {

    return super.canBeParent(parent);
  }


  canBeChild(child) {

    // return super.canBeChild(child);
    return false;
  }


  renderChildren() {

    // const {
    // } = this.context;

    // const {
    // } = this.getEditorContext();

    // const {
    //   ...other
    // } = this.getComponentProps(this);

    // return super.renderChildren();

    return <ConnectorContext.Consumer
      key="TopicsPage"
    >
      {connectorContext => {

        return <ForumView
          {...connectorContext}
          Toolbar={null}
          withPagination={false}
        />
      }}
    </ConnectorContext.Consumer>

  }

}

export default TopicsPage;