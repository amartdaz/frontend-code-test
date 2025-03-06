import React from "react";
import { observer } from "mobx-react";
import BoxDraggable from "./BoxDraggable";

function Box(props) {
  return (
    <BoxDraggable {...props}>
      <p style={{fontWeight: props.box.selected ? '800' : '300'}}>{props.box.selected ? 'Selected Box' : 'Box'}</p>
    </BoxDraggable>
  );
}

export default observer(Box);
