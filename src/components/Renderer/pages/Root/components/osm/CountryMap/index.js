import React from 'react';

import EditorComponent from '@prisma-cms/front-editor/lib/components/App/components/';
import { ObjectContext } from '@prisma-cms/front-editor/lib/components/App/components/public/Connectors/Connector/ListView';
import OsmMap from '../../../../../../osm/OsmMap';

export class CountryMap extends EditorComponent {

  static Name = 'CountryMap';

  static defaultProps = {
    ...EditorComponent.defaultProps,
    hide_wrapper_in_default_mode: true,
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
        CountryMap
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

    return <ObjectContext.Consumer
      key="CountryMap"
    >
      {objectContext => {

        const {
          object,
        } = objectContext;

        const {
          lat,
          lon,
        } = object;

        if (!isFinite(lat) || !isFinite(lon)) {
          return null;
        }

        return <OsmMap
          lat={lat}
          lon={lon}
        />;
      }}
    </ObjectContext.Consumer>
  }

}

export default CountryMap;