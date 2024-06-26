import { useState, useEffect } from "react";
import axios from 'axios';
import "./notas.css"
import { NavLink } from "react-router-dom";

// const serverFront = "http://localhost:3001";
const serverFront = 'https://servermern-yurb.onrender.com'

export function Notas() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewtasks] = useState("");
    const [newDescripcion, setNewDescrition] = useState(""); // se cambio day por descripcion


    useEffect(() => {
        axios.get(`${serverFront}/tasks`)
        .then(response => {
            setTasks(response.data)
        })
        .catch(err => console.log(err))
    },[serverFront])

    const addTask = () => {
        if(newTask.trim() && newDescripcion.trim()) {
            axios.post(`${serverFront}/add-task`, {
                task:newTask,
                descripcion:newDescripcion
            })
            .then(response => {
                const nuevaTarea = response.data;
                setTasks(tasks => [...tasks, nuevaTarea])
                setNewtasks("")
                setNewDescrition("")
            })
            .catch(err => console.log(err))
        }
    }

    const deleteTask = (id) => {
        axios.delete(`${serverFront}/delete-task/` + id)
        .then( response => {
            setTasks(tasks.filter((task) => task._id !== id))
        })
        .catch(err => console.log(err))
    }


    const taskCompleted = (id,completed) =>{
        axios.patch(`${serverFront}/update-task/${id}`, { completed: !completed })
        .then(response => {
            const updatedTasks = tasks.map(task => task._id === id ? response.data : task);
            setTasks(updatedTasks);
        })
        .catch(err => console.log(err));
    }

    const taksUp = (index) =>{
        if(index > 0) {
            const taskMove = [...tasks];
            [taskMove[index], taskMove[index - 1]] = [taskMove[index - 1], taskMove[index]];
            setTasks(taskMove);
            updateTaskOrder(taskMove);
        }
    }

    const taksDown = (index) => {
        if ( index < tasks.length - 1 ) {
            const moveTask = [...tasks];
            [moveTask[index], moveTask[index + 1 ]] = [moveTask[ index + 1], moveTask[index]];
            setTasks(moveTask);
            updateTaskOrder(moveTask);;
        }
    }
    

        // actualizar orden de tareas
        const updateTaskOrder = (orderedTasks) => {
            axios.post(`${serverFront}/update-order`, orderedTasks)
                .catch(err => console.log(err));
        }

    return (
        <>
            <NavLink to="/"> <button className="calendario"> Calendario </button></NavLink>
            <div className="nota">
                <h2> Notas adicionales </h2>
                <div className="nota-input">
                    <input
                        type="text"
                        placeholder="Agregar nueva tarea ...."
                        onChange={(event) => setNewtasks(event.target.value)}
                        value={newTask}
                    />
                    <input
                        type="text"
                        placeholder="Agregar descripcion ...."
                        onChange={(event) => setNewDescrition(event.target.value)}
                        value={newDescripcion}
                    />
                    <button className="agregar" onClick={addTask}>Agregar</button>
                </div>
                <div className="notas">
                    <table>
                        
                        <thead>
                            <tr>
                                <th></th>
                                <th>Tarea</th>
                                <th>Descripcion</th>
                                <th></th>
                            </tr>
                            
                        </thead>
                        
                        <tbody>
                            
                            {tasks.map((element, index) => (
                                <tr key={index} className={element.completed ? "completed" : ""}>
                                    <div className="move">
                                    <button onClick={() => taksUp(index)}> ☝️ </button>
                                    <button onClick={() => taksDown(index)}> 👇 </button>
                                    </div>
                                <td>{element.task}</td>
                                <td>{element.descripcion}</td>
                                    <td className="notas-buttons">
                                    
                                    <button
                                            className={element.completed ? "desmarcar" : "completar"}
                                            onClick={() => taskCompleted(element._id, element.completed)}
                                        >
                                            {element.completed ? "Desmarcar" : "Completar"}
                                        </button>
                                        <button onClick={() => deleteTask(element._id)}>Eliminar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </>
    );
}
