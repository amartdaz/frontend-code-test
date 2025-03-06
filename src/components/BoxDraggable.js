import React, { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react";
import store from "../stores/MainStore";
import interact from 'interactjs';

function BoxDraggable(props) {
  const [isDragging, setIsDragging] = useState(false);
  const draggableRef = useRef(null);

  useEffect(() => {
    if(draggableRef.current) {
      interact(draggableRef.current)
      .draggable({
        inertia: true,
        modifiers: [
          interact.modifiers.restrictRect({
            restriction: 'parent',
            endOnly: false,
          })
        ],
        autoScroll: true,
        listeners: {
          move: dragMoveListener,
          start () {
            setIsDragging(true);
          },
          end (event) {
            props.box.changeCoordinates(event.target.getAttribute('data-x'), event.target.getAttribute('data-y'));
            store.selectedBoxesLength > 0 && store.selectedBoxes.forEach(box => {
              const element = document.getElementById(box.id);
              box.changeCoordinates(parseFloat(element.getAttribute('data-x')), parseFloat(element.getAttribute('data-y')));
            })
          }
        },
      });
    }

    function dragMoveListener(event) {
      if(store.getSelectedBoxes() > 0) {
        handleDragSelectedBoxes(event);
        return;
      }
      var target = event.target;
      var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
      var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

      target.style.webkitTransform =
        target.style.transform =
          'translate(' + x + 'px, ' + y + 'px)';

      target.setAttribute('data-x', x);
      target.setAttribute('data-y', y);
    }

    const handleDragSelectedBoxes = (event) => {
      if(!store.selectedBoxes.map(box => box.id).includes(event.target.getAttribute('id'))) return;
      store.selectedBoxes.forEach(box => {
        const boxElement = document.getElementById(box.id);
        if (boxElement) {
          var x = (parseFloat(boxElement.getAttribute('data-x')) || 0) + event.dx;
          var y = (parseFloat(boxElement.getAttribute('data-y')) || 0) + event.dy;

          boxElement.style.webkitTransform =
            boxElement.style.transform =
              'translate(' + x + 'px, ' + y + 'px)';

          boxElement.setAttribute('data-x', x > 1000 ? 1000 : x);
          boxElement.setAttribute('data-y', y > 575 ? 575 : y);
        }
      })
    }
  }, [props]);

  const handleClick = () => {
    if(isDragging) {  
      setIsDragging(false);
      return;
    }
    store.selectBox(props.box.id);
  }

  return (
    <div
      ref={draggableRef}
      id={props.id}
      className="box"
      data-x={props.left}
      data-y={props.top}
      style={{
        backgroundColor: props.color,
        width: props.width,
        height: props.height,
        transform: `translate(${props.left}px, ${props.top}px)`,
        userSelect: 'none',
      }}
      onClick={handleClick}
    >
      {props.children}
    </div>
  );
}

export default observer(BoxDraggable);
