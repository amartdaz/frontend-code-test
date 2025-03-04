import React, { useState } from "react";
import BoxModel from "../stores/models/Box";
import uuid from "uuid/v4";
import getRandomColor from "../utils/getRandomColor";
import { observer } from "mobx-react";

function Toolbar({store}) {
  const [coordinates, setCoordinates] = useState({top: 25, left: 25});

  const addBox = () => {
    // Update coordinates
    setCoordinates(prev => ({
      top: prev.top + 25,
      left: prev.left + 25
    }));

    store.addBox(
      BoxModel.create({
        id: uuid(),
        color: getRandomColor(),
        left: coordinates.left,
        top: coordinates.top
      })
    );
  };

  return (
    <div className="toolbar">
      <button onClick={addBox}>Add Box</button>
      <button onClick={store.removeBoxes}>Remove Box</button>
      <button onClick={() => {window.localStorage.setItem('store', JSON.stringify(store))}}>Save locally</button>
      <input type="color" onChange={(event) => store.changeColor(event.target.value)}/>
      <span>{`Selected: ${store.selectedBoxes}`}</span>
      <span>{`; Total: ${store.countBoxes}`}</span>
    </div>
  );
}

export default observer(Toolbar);
