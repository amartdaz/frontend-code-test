import React from "react";
import { observer } from "mobx-react";
import BoxDraggable from "./BoxDraggable";

function Box(props) {
  return (
    <BoxDraggable {...props}>
      <div>
        <p style={{fontWeight: props.box.selected ? '800' : '300'}}>{props.box.selected ? 'Selected Box' : 'Box'}</p>
      </div>
    </BoxDraggable>
  );
}

export default observer(Box);
