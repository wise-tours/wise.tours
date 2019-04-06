import React, { Component } from 'react';
import PropTypes from 'prop-types';

import EditorComponent from '@prisma-cms/front/lib/components/FrontEditor/components/';
import { ObjectContext } from '@prisma-cms/front/lib/components/FrontEditor/components/Connector/ListView';




class TopicLink extends EditorComponent {


  static Name = "TopicLink";

  renderPanelView() {

    const {
      classes,
    } = this.context;

    return super.renderPanelView(<div
      className={classes.panelButton}
    >
      Ссылка на топик
    </div>);
  }


  renderMainView() {

    const {
      TopicLink: PrismaCmsTopicLink,
    } = this.context;

    return <span
      {...this.getRenderProps()}
    >
      <ObjectContext.Consumer>
        {context => {

          const {
            object,
            ...other
          } = context;

          if (!object) {
            return null;
          }

          return <PrismaCmsTopicLink
            object={object}
            {...other}
          />

        }}
      </ObjectContext.Consumer>
    </span>;
  }

}

export default TopicLink;
