import React, { useState } from "react";
import BoxModel from "../stores/models/Box";
import uuid from "uuid/v4";
import getRandomColor from "../utils/getRandomColor";
import { observer } from "mobx-react";
import { applySnapshot, getSnapshot, onSnapshot } from "mobx-state-tree";

function Toolbar({store}) {
  const [ state, setState ] = useState([getSnapshot(store)]);
  const [ currentFrame, setCurrentFrame ] = useState(0);

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
    store.addBox(
      BoxModel.create({
        id: uuid(),
        color: getRandomColor(),
        left: Math.floor(Math.random()*1000),
        top: Math.floor(Math.random()*575)
      })
    );
  };

  return (
    <div className="toolbar">
      <button onClick={addBox}>Add Box</button>
      <button onClick={store.removeBoxes}>Remove Box</button>
      <button onClick={previousState}>Undo</button>
      <button onClick={nextState}>Redo</button>
      <input type="color" disabled={store.selectedBoxesLength <= 0} onChange={(event) => store.changeColor(event.target.value)}/>
      <span>{`Selected: ${store.selectedBoxesLength}`}</span>
      <span>{`; Total: ${store.countBoxes}`}</span>
    </div>
  );
}

export default observer(Toolbar);
