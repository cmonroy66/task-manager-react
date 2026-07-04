import { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import TaskInput from "./components/TaskInput";
import TaskList from "./components/TaskList";
import Footer from "./components/Footer";

type Task = {
    id: number;
    text: string;
    completed: boolean;
};

function App() {
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => { 
        const fetchTasks = async () => { 
            const response = await fetch("http://localhost:3000/tasks"); 
            const data = await response.json(); setTasks(data); 
        }; 
        fetchTasks(); 
    }, []);

    const addTask = async (text: string) => {    
        const response = await fetch("http://localhost:3000/tasks", {        
            method: "POST",        
            headers: {            
                "Content-Type": "application/json"        
            },        
            body: JSON.stringify({            
                text: text        
            })    
        });    
        const newTask = await response.json();    
        setTasks([...tasks, newTask]); 
    };

    const deleteTask = async (id: number) => {
        try {
            const response = await fetch(`http://localhost:3000/tasks/${id}`, {
                method: "DELETE"
            });
            if (!response.ok) {
                throw new Error("No se pudo eliminar la tarea en el servidor");
            }
            
            const updatedTasks = tasks.filter((task) => task.id !== id);
            setTasks(updatedTasks);
        } catch (error) {
            console.error("Error al eliminar la tarea:", error);
        }
    };

    const toggleTask = async (id: number) => {
        const taskToToggle = tasks.find((task) => task.id === id);
        if (!taskToToggle) return;
        const response = await fetch(`http://localhost:3000/tasks/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    completed: !taskToToggle.completed
                })
            });
            if (!response.ok) {
                throw new Error("No se pudo actualizar la tarea en el servidor");
            }
            
            const updatedTask = await response.json();
            
            const updatedTasks = tasks.map((task) => {
                if (task.id === id) {
                    return updatedTask;
                }
                return task;
            });
            setTasks(updatedTasks);
    };

    const completedTasks = tasks.filter((task) => task.completed).length;
    const pendingTasks = tasks.length - completedTasks;

    return (
        <div className="app-container">
            <Header />
            <TaskInput onAddTask={addTask} />
            <TaskList
                tasks={tasks}
                onDeleteTask={deleteTask}
                onToggleTask={toggleTask}
            />
            <Footer
                total={tasks.length}
                completed={completedTasks}
                pending={pendingTasks} />
        </div>
    );
}

export default App;