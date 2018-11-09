import React, { Component } from 'react';

import GridProto from "material-ui/Grid";

export default class Grid extends GridProto{


  render(){

    const {
      spacing,
      ...other
    } = this.props;

    let content = super.render();


    return spacing > 0 ? <div
      style={{
        padding: spacing / 2,
      }}
    >{content}</div> : content;

  }

}