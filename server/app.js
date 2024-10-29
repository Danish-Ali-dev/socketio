import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";

const port = 4000;
const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
    }
});

app.use(cors());

app.get("/", (req, res)=>{
    res.send("Hello World");
});

io.on("connection", (socket)=>{
    console.log("User connected");
    console.log("ID: ", socket );
    // socket.emit("welcome", `Welcome to the server`);     // yh msg hr user ko jay ga
    // socket.broadcast.emit("welcome", `${socket.id} joined the server`);   // yh msg login user ka ilawa sb ko jay ga
    socket.on("message", ({room, message}) => {
        console.log(message);
        socket.to(room).emit("receive-message", message);  // we can also use io.to instead of socket.to
    })

    socket.on("join-room", (room) => {
        socket.join(room);
        console.log("User joined room: ", room);
    })

    socket.on("disconnect", ()=>{
        console.log("User Disconnected", socket.id);
    })
})

server.listen(port, ()=> {
    console.log(`server is starting at port: ${port}`)
});