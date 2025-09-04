import React from 'react';
import {useDroppable} from '@dnd-kit/core';

export function Droppable(props) {
  const {isOver, setNodeRef} = useDroppable({
    id: props.id,
  });

  return (
    <div ref={setNodeRef} className={`h-fit
    ${isOver ? "text-green-500 border-green-500" : "text-black-500 border-black-500"}`
    }>
      {props.children}
    </div>
  );
}