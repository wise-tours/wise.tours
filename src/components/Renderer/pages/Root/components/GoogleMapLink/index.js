import React from 'react';

import EditorComponent from '@prisma-cms/front-editor/lib/components/App/components/';
import { ObjectContext } from '@prisma-cms/front-editor/lib/components/App/components/public/Connectors/Connector/ListView';

export class GoogleMapLink extends EditorComponent {

  static Name = 'GoogleMapLink';

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
        GoogleMapLink
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

    return super.canBeChild(child);
  }


  renderChildren() {

    // const {
    // } = this.context;

    // const {
    // } = this.getEditorContext();

    // const {
    //   ...other
    // } = this.getComponentProps(this);

    const children = super.renderChildren();

    return <ObjectContext.Consumer
      key="GoogleMapLink"
    >
      {objectContext => {

        // console.log('CodeChallengeRenderer objectContext', objectContext);

        const {
          object,
        } = objectContext;

        if (!object) {
          return null;
        }

        const {
          lat,
          lon,
        } = object;

        if (!lat || !lon) {
          return null;
        }

        const href = `https://www.google.com/maps/@${lat},${lon},8z`;

        return <a
          href={href}
          title={"Open in Google Maps"}
          target="_blank"
          rel="nofollow noopener noreferrer"
        >
          {children && children.length ? children : `${lat}:${lon}`}
        </a>
      }}
    </ObjectContext.Consumer>
  }

}

export default GoogleMapLink;