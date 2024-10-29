import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { Button, Container, TextField, Typography, Stack } from "@mui/material";

const App = () => {
  const socket = useMemo(() => io("http://localhost:4000"), []);
  const [allMessages, setAllMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [roomName, setRoomName] = useState("");
  const [socketId, setSocketId] = useState("");
  const [room, setRoom] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    if (message && room) {
      socket.emit("message", { room, message });
      setMessage("");
    }
  };

  const joinRoomHandler = (e) => {
    e.preventDefault();
    socket.emit("join-room", roomName);
    setRoomName("");
  }

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id);
      console.log("Connected to server", socket.id);
      socket.on("welcome", (s) => console.log(s));
    });

    socket.on("receive-message", (data) => {
      console.log(data);
      setAllMessages((messages) => [...messages, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="div" gutterBottom>
        {socketId}
      </Typography>

      <form onSubmit={joinRoomHandler}>
        <TextField
          id="message-input"
          label="Room Name"
          variant="outlined"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        />
        <Button variant="contained" type="submit">
          Join
        </Button>
      </form>

      <form onSubmit={submitHandler}>
        <TextField
          id="message-input"
          label="Message"
          variant="outlined"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <TextField
          id="room-input"
          label="Room"
          variant="outlined"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
        <Button variant="contained" type="submit">
          Send
        </Button>
      </form>
      
      <Stack spacing={2} mt={2}>
        {allMessages.map((msg, index) => (
          <Typography key={`${msg}-${index}`} variant="body2" component="div">
            {msg}
          </Typography>
        ))}
      </Stack>
    </Container>
  );
};

export default App;
