import React from "react";
import { observer } from "mobx-react";
import BoxDraggable from "./BoxDraggable";

function Box(props) {
  return (
    <BoxDraggable {...props}>
      <p style={{fontWeight: props.box.selected ? '500' : '300'}}>Box</p>
    </BoxDraggable>
  );
}

export default observer(Box);
