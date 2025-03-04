import React, { useEffect, useRef } from "react";
import { observer } from "mobx-react";
import store from "../stores/MainStore";
import interact from 'interactjs';

function BoxDraggable(props) {
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
          },
          onend: function (event) {
            console.log('Drag end');
          }
        });
      }

    function dragMoveListener(event) {
      var target = event.target;
      var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
      var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

      target.style.webkitTransform =
        target.style.transform =
          'translate(' + x + 'px, ' + y + 'px)';

      target.setAttribute('data-x', x);
      target.setAttribute('data-y', y);
    }
  }, []);

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
        transform: `translate(${props.left}px, ${props.top}px)`
      }}
      onClick={() => {store.selectBox(props.box.id)}}
    >
      {props.children}
    </div>
  );
}

export default observer(BoxDraggable);
