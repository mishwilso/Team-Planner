import {useEffect, useState } from 'react';
import io from 'socket.io-client';
import './App.css';

const socket = io('http://localhost:4000');         // Connect to backend server

// Define task interface
interface Task{
    id: string;
    title: string;
    status: 'todo' | 'doing' | 'done';
}

const App = () => {
    const [tasks, setTasks] = useState<Task[]>([]);  //traking current task list

    // when comps mount, listen for updates
    useEffect(() => {
        socket.on('task_update', (data: Task[]) => {
            setTasks(data); //update local state
        });
        return () => {
            socket.off('task_update'); //cleanup on mount
        };
    }, []);


    //update a task status and notify server
    const updateTask = (id: string, newStatus: Task['status']) => {
        const updated = tasks.map(task =>
            task.id === id ? { ...task, status: newStatus } : task
        );
        setTasks(updated);
        socket.emit('task_update', updated) //let the surver know whats up 
    };

    // make new task
    const createTask = () => {
        const newTask = {
            id: Math.random().toString(36).substr(2, 9),
            title: `Task ${tasks.length + 1}`,
            status: 'todo' as const,
        };
        const updated = [...tasks, newTask];
        setTasks(updated);
        socket.emit('task_update', updated);
    }


    // make task column (to do, doing, done)
    const renderColumn = (status: Task['status']) => (
        <div className ="column">
            <h3>{status.toUpperCase()}</h3>
            {tasks.filter(t => t.status === status).map(task => (
                <div key={task.id} className ="task" onClick={() => {
                    if (status === 'todo') updateTask(task.id, 'doing');
                    else if (status === 'doing') updateTask(task.id, 'done');
                }}>
                    {task.title}
                </div>
            ))}
        </div>
    );

    return (
        <div className="App">
            <h1> Team Planner (Demo) </h1>
            <button onClick={createTask}>New Task</button>
            <div className="board">
                {renderColumn('todo')}
                {renderColumn('doing')}
                {renderColumn('done')}
            </div>
        </div>
    );


};

export default App;