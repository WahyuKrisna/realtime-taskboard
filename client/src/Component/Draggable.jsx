import React from 'react';
import {useDraggable} from '@dnd-kit/core';

export function Draggable(props) {
  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id: props.id,
  });
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  
  return (
    <div ref={setNodeRef} style={style} 
        className={`border rounded-xl px-4 py-2 bg-white h-[50px] cursor-pointer mb-2 w-full border-black-500 flex flex-row justify-between items-center`} 
        {...listeners} {...attributes}>
      {props.children}
    </div>
  );
}