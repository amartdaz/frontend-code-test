import React, { useEffect, useState } from "react";
import BoxModel from "../stores/models/Box";
import uuid from "uuid/v4";
import getRandomColor from "../utils/getRandomColor";
import { observer } from "mobx-react";
import { applySnapshot, getSnapshot, onSnapshot } from "mobx-state-tree";

function Toolbar({store}) {
  const [ state, setState ] = useState([getSnapshot(store)]);
  const [ currentFrame, setCurrentFrame ] = useState(0);
  
  useEffect(() => {
    document.getElementById('colorInput').addEventListener('change', (event) => {
    store.changeColor(event.target.value)
  })
  }, [store]);

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
      <div className="history">
        <button onClick={previousState}>Undo</button>
        <button onClick={nextState}>Redo</button>
      </div>
      <div className="information">
        <span>{`Selected: ${store.selectedBoxesLength}`}</span>
        <span style={{marginLeft: '5px'}}>{`Total: ${store.countBoxes}`}</span>
      </div>
      <div className="actions">
        <button onClick={addBox}>Add Box</button>
        <button onClick={store.removeBoxes}>Remove Box</button>
        <input id='colorInput' type="color" disabled={store.selectedBoxesLength <= 0}/>
      </div>
    </div>
  );
}

export default observer(Toolbar);
