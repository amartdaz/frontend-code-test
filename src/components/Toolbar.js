import React, { useState } from "react";
import BoxModel from "../stores/models/Box";
import uuid from "uuid/v4";
import getRandomColor from "../utils/getRandomColor";
import { observer } from "mobx-react";
import { applySnapshot, onSnapshot } from "mobx-state-tree";

function Toolbar({store}) {
  const [coordinates, setCoordinates] = useState({top: 25, left: 25});
  const [ state, setState ] = useState([]);
  const [ currentFrame, setCurrentFrame ] = useState(-1);

  onSnapshot(store, snapshot => {
    if(currentFrame === state.length - 1) {
      setCurrentFrame(currentFrame + 1);
      setState([...state, snapshot]);
    }
  });

  const previousState = () => {
    if(currentFrame > 0) {
      applySnapshot(store, state[currentFrame - 1]);
      setCurrentFrame(currentFrame - 1); 
    }
  }

  const nextState = () => {
    if (currentFrame < state.length - 1) {
      applySnapshot(store, state[currentFrame + 1]);
      setCurrentFrame(currentFrame + 1);
    }
  }

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
      <button onClick={previousState}>Undo</button>
      <button onClick={nextState}>Redo</button>
      <input type="color" onChange={(event) => store.changeColor(event.target.value)}/>
      <span>{`Selected: ${store.selectedBoxes}`}</span>
      <span>{`; Total: ${store.countBoxes}`}</span>
    </div>
  );
}

export default observer(Toolbar);
