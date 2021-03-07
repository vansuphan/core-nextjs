import * as React from 'react';
import * as Pixi from 'pixi.js';

export class DrawScene extends React.Component {
  constructor(props) {
    super(props);
    this.pixi_cnt = null;
  }
updatePixiCnt= (element) => {
    // the element is the DOM object that we will use as container to add pixi stage(canvas)
    this.pixi_cnt = element;
 };
  
render() {
    return <div ref={this.updatePixiCnt} />;
  }
}

