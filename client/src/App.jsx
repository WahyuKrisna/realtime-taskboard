import React, {useState} from 'react';
import {DndContext} from '@dnd-kit/core';

import {Droppable} from './Component/Dropable';
import {Draggable} from './Component/Draggable';
import './App.css'

function App() {
    const [newTaskInput, setNewTaskInput] = useState("");
    const [isDrag, setIsDrag] = useState(false);
    const [columns, setColumns] = useState({
        backlog: ['task-1'],
        todo: ['task-2'],
        inProgress: [],
        done: [],
    });
    
    const [tasks, setTasks] = useState({
        "task-1": { content: "Backlog task" },
        "task-2": { content: "Backlog task 2" },
    });

    const handleDragEnd = ({ active, over }) => {
        const taskId = active.id;
        const targetCol = over.id;
        
        if(targetCol == "trash"){
            removeTask(taskId)
        }else{
            // find source column
            const sourceCol = Object.entries(columns).find(([colId, taskIds]) =>
                taskIds.includes(taskId)
            )[0];

            if (sourceCol === targetCol) return; // no move

            // now move the task
            setColumns(prev => {
                const newSource = prev[sourceCol].filter(id => id !== taskId);
                const newTarget = [...prev[targetCol], taskId];

                return {
                ...prev,
                [sourceCol]: newSource,
                [targetCol]: newTarget,
                };
            });
        }

        setIsDrag(false)
    };

    const addTask = () => {
        const targetCol = "backlog"
        const id = `task-${Date.now()}`; // unique id
        
        setTasks(prevTasks => ({ ...prevTasks, [id]: { content:newTaskInput } }));
        setColumns(prevCols => ({
            ...prevCols,
            [targetCol]: [...prevCols[targetCol], id],
        }));

        setNewTaskInput("")
    }

    const removeTask = (taskId) => {
        // remove from tasks
        setTasks(prev => {
            const newTasks = { ...prev };
            delete newTasks[taskId];
            return newTasks;
        });

        // remove from columns
        setColumns(prev => {
            const newCols = {};
            for (const [colId, taskIds] of Object.entries(prev)) {
            newCols[colId] = taskIds.filter(id => id !== taskId);
            }
            return newCols;
        });
    }

  return (
    <DndContext onDragEnd={handleDragEnd} onDragStart={()=>setIsDrag(true)}>
        <div className='w-full flex flex-col items-center'>
            {/* Add Task */}
            <div className='mb-4'>
                <label>New Task : </label>
                <input className="p-2 mx-2 border border-indigo-600 rounded-xl" type='text' value={newTaskInput} onChange={(e)=>setNewTaskInput(e.target.value)}/>
                <button className='p-[5px] m-[5px] bg-indigo-200 border border-indigo-600 w-[40px] rounded-lg' onClick={()=>addTask()}>+</button>
            </div>
            {/* DND */}
            <div className='w-full flex flex-row'>
            {Object.entries(columns).map(([colId, colTaskIds]) => (
                <div className="w-1/4 p-2 m-2 border border-indigo-600 h-fit" key={colId}>
                    {/* Header area */}
                    <h2 className='mt-2 mb-4 text-bold text-center text-xl text-bold capitalize'>
                        {colId}
                    </h2>


                    {/* Dropable area */}
                    <Droppable key={colId} id={colId}>
                        {colTaskIds.length > 0 ? 
                        colTaskIds.map(colTaskId => (
                        Object.entries(tasks).map(([taskId,taskContent]) => (
                                taskId == colTaskId ?
                                <Draggable key={taskId} id={taskId}>
                                    {taskContent.content}
                                </Draggable> :
                                ''
                            ))
                        )):
                        'Drop Here'
                        }
                    </Droppable>
                </div>
            ))}
            </div>
            {/* Trash Area */}
            <Droppable key="trash" id="trash">
                <div className={`bg-red-200 border border-red-600 text-slate-600 text-bold text-lg rounded-lg w-[200px] h-[100px] 
                flex flex-row justify-center items-center mt-6 ${isDrag?'block':'hidden'}`}>
                    Drop here to delete
                </div>
            </Droppable>
        </div>
    </DndContext>
  );
};

export default App
