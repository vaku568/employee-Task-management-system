const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const User = require("../src/models/User");

let io;

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      credentials: true,
      methods: ["GET", "POST"],
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // Authentication middleware for Socket.IO
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error("Authentication error: No token provided"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return next(new Error("Authentication error: User not found"));
      }

      socket.user = user;
      socket.userId = user._id.toString();
      next();
    } catch (error) {
      next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.userId}, Role: ${socket.user?.role}`);
    console.log(`Socket ID: ${socket.id}`);
    console.log(`Socket userId type: ${typeof socket.userId}`);
    console.log(`Socket userId string: ${String(socket.userId)}`);

    // Join private room with user ID
    socket.join(socket.userId);
    console.log(`User ${socket.userId} joined room: ${socket.userId}`);
    console.log(`Socket rooms after join:`, socket.rooms);

    // Handle socket events
    require("./socketHandler")(socket, io);

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.userId}, Role: ${socket.user?.role}`);
    });

    socket.on("error", (error) => {
      console.error(`Socket error for user ${socket.userId}:`, error);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO not initialized");
  }
  return io;
};

module.exports = { initializeSocket, getIO };
