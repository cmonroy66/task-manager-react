const cors = require("cors");
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const app = express();
app.use(cors());
app.use(express.json());
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

let tasks: Task[] = [];

app.get("/", (req: any, res: any) => {
    res.send("Backend is working!");
});

// JWT: This is a basic login route. 
// JWT: For now, we are using fixed credentials only for practice. 
app.post("/login", (req: any, res: any) => {    
    const { email, password } = req.body || {};    
    if (email === "admin@test.com" && password === "123456") {        
        // JWT: If the credentials are correct, we create a token.        
        const token = jwt.sign(            
        // JWT: This is the information stored inside the token.            
        { email: email },            
        // JWT: This secret is used to sign the token.            
        "secret_key",            
        // JWT: The token will expire in 1 hour.            
        { expiresIn: "1h" }   
    );        
    return res.json({            
        message: "Login successful",            
        token: token        
    });    
    }    
    res.status(401).json({        
        message: "Invalid credentials"    
    }); 
});

app.get("/tasks", async (req: any, res: any) => {
    const tasksFromDatabase = await prisma.task.findMany();
    res.json(tasksFromDatabase); 
});

app.post("/tasks", async (req: any, res: any) => {    
    const { text } = req.body || {};    
    if (!text || text.trim() === "") {
         return res.status(400).json({            
            message: "Task text is required"        
        });    
    }
    const newTask = await prisma.task.create({
       data: { 
        text: text.trim(),
        completed: false
       }
    });
    res.status(201).json(newTask);
});

app.put("/tasks/:id", async (req: any, res: any) => {
    const id = Number(req.params.id);    
    const { text, completed } = req.body || {};    
    const task = await prisma.task.findUnique({
            where: { id: id }
        });  

    if (!task) {        
        return res.status(404).json({            
        message: "Task not found"        
        });    
    }    
    const updatedTask: Task = await prisma.task.update({
            where: { id: id },
            data: {
                text: text !== undefined ? text.trim() : task.text,
                completed: completed !== undefined ? completed : !task.completed
            }
        });

    res.json(updatedTask); 
});

app.delete("/tasks/:id", async (req: any, res: any) => {
    const id = Number(req.params.id);    
    
    const task = await prisma.task.findUnique({
        where: { id: id }
    });  
    if (!task) {        
        return res.status(404).json({            
            message: "Task not found"        
        });    
    }    
    
    const deletedTask: Task = await prisma.task.delete({
        where: { id: id }
    });
    res.json(deletedTask); 
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});