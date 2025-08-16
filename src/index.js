import express from "express";
import dotenv from "dotenv";
import pool from "./backend/db/db.js";
import exerciseRoutes from "./backend/routes/exerciseRoutes.js";
import userRoutes from "./backend/routes/userRoutes.js";
import workoutRoutes from "./backend/routes/workoutRoutes.js";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "http";
import { getByUsernameService } from "./backend/services/userServices.js";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

// Online Users
const users = new Map();

// Middleware
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));

// Routes
app.use("/exercises", exerciseRoutes);
app.use("/users", userRoutes);
app.use("/workouts", workoutRoutes);

// Testing POSTGRES Connection
app.get("/", async (req, res) => {
  const result = await pool.query("SELECT current_database()");
  res.send(`The database name is: ${result.rows[0].current_database}`);
});

// Start Combined Server
io.on("connection", (socket) => {
  socket.on("user:login", (username) => {
    console.log(`User ${username} is now online with socket ID ${socket.id}`);
    users.set(username, socket.id);
  });

  socket.on("disconnect", () => {
    const disconnectedUsername = [...users.entries()].find(
      ([username, socketId]) => socketId === socket.id
    )?.[0];
    console.log(disconnectedUsername);
    if (disconnectedUsername) {
      users.delete(disconnectedUsername);
    }
    console.log(`${disconnectedUsername} disconnected`);
  });

  socket.on(
    "chat message",
    async ({
      senderUsername,
      recipientUsername,
      content,
      timestamp,
      workoutId,
    }) => {
      try {
        // get id of sender
        const senderId = (await getByUsernameService(senderUsername)).id;
        // get id of reciever
        const recieverId = (await getByUsernameService(recipientUsername)).id;

        // db query
        let query =
          "INSERT INTO messages (user_id, friend_id, message, created_at) VALUES ($1, $2, $3, $4)";
        let message;
        if (workoutId) {
          message = {
            senderUsername,
            recipientUsername,
            content,
            timestamp: new Date(),
            workoutId,
          };
          query =
            "INSERT INTO messages (user_id, friend_id, message, created_at, workout_id) VALUES ($1, $2, $3, $4, $5)";

          await pool.query(query, [
            senderId,
            recieverId,
            content,
            timestamp,
            workoutId,
          ]);
        } else {
          message = {
            senderUsername,
            recipientUsername,
            content,
            timestamp: new Date(),
          };
          await pool.query(query, [senderId, recieverId, content, timestamp]);
        }

        // send message back to sender
        console.log("message", message);
        socket.emit("chat message", { ...message, fromSelf: true });

        // send message to recipient
        const recipientSocketId = users.get(recipientUsername);
        if (message.recipientUsername === message.senderUsername) {
          socket.emit("chat message", {
            ...message,
            fromSelf: false,
          });
        } else if (recipientSocketId) {
          socket.to(recipientSocketId).emit("chat message", {
            ...message,
            fromSelf: false,
          });
        }
      } catch (err) {
        console.error("Error in saving message to database", err.message);
      }
    }
  );
});

const port = process.env.PORT || 3001;

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log(`Socket.IO server also running on http://localhost:${port}`);
});