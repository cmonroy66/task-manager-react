const express = require("express");
// PRISMA CHANGE: Import Prisma Client
const { PrismaClient } = require("@prisma/client");

const app = express();
const PORT = 3000;
// PRISMA CHANGE: Create the connection to PostgreSQL through Prisma
const prisma = new PrismaClient();

app.use(express.json());

type Task = {
    id: number;    
    text: string;    
    completed: boolean; 
};
//This array is still here because POST, PUT, and DELETE requests are not yet connected to Prisma yet.
//PRISMA CHANGE: /tasks will no longer use this array

let tasks: Task[] = [    
    { id: 1, text: "Estudiar Node.js", completed: false },    
    { id: 2, text: "Crear servidor Express", completed: true },    
    { id: 3, text: "Probar rutas del backend", completed: false }
];

app.get("/", (req: any, res: any) => {
    res.send("Backend is working!");
});

app.get("/tasks", async (req: any, res: any) => {
    const tasksFromDatabase = await prisma.task.findMany();
    res.json(tasksFromDatabase); 
});

app.post("/tasks", (req: any, res: any) => {    
    const { text } = req.body || {};    
    if (!text || text.trim() === "") {
         return res.status(400).json({            
            message: "Task text is required"        
        });    
    }
    const newTask: Task = {        
        id: Date.now(),        
        text: text.trim(),        
        completed: false    
    };    
    tasks.push(newTask);    
    res.status(201).json(newTask); 
});

app.put("/tasks/:id", (req: any, res: any) => {
    const id = Number(req.params.id);    
    const { text, completed } = req.body;    
    const task = tasks.find((task) => task.id === id);    
    if (!task) {        
        return res.status(404).json({            
        message: "Task not found"        
        });    
    }    
    task.completed = !task.completed;
    res.json(task); 
});

app.delete("/tasks/:id", (req: any, res: any) => {
    const id = Number(req.params.id);
    const taskExists = tasks.some((task) => task.id === id);
    if (!taskExists) {
        return res.status(404).json({ 
            message: "Task not found" 
        });
    }
    const updatedTasks = tasks.filter((task) => task.id !== id);
    tasks.length = 0;
    tasks.push(...updatedTasks);
    res.json({ 
        message: "Task deleted successfully",
        tasks: tasks
     });

});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});