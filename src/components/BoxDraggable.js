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
        restrict: {
          restriction: "parent",
          endOnly: false,
          elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
        },
        autoScroll: true,
        onmove: dragMoveListener,
        onstart: function (event) {
          console.log('Drag start');
          setIsDragging(true);
        },
        onend: function (event) {
          console.log('Drag end');
        }
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
      props.box.changeCoordinates(x, y);
    }

    const handleDragSelectedBoxes = (event) => {
      const selectedBoxes = store.boxes.filter(box => box.selected);
      if(!selectedBoxes.map(box => box.id).includes(event.target.getAttribute('id'))) return;
      selectedBoxes.forEach(box => {
        const boxElement = document.getElementById(box.id);
        if (boxElement) {
          var x = (parseFloat(boxElement.getAttribute('data-x')) || 0) + event.dx;
          var y = (parseFloat(boxElement.getAttribute('data-y')) || 0) + event.dy;

          boxElement.style.webkitTransform =
            boxElement.style.transform =
              'translate(' + x + 'px, ' + y + 'px)';

          boxElement.setAttribute('data-x', x);
          boxElement.setAttribute('data-y', y);

          box.changeCoordinates(x, y);
        }
      })
    }
  }, []);

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
