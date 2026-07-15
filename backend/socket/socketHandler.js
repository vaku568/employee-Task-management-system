module.exports = (socket, io) => {
  // NEW_MESSAGE event - for Team Chat
  socket.on("sendMessage", async (data) => {
    try {
      const { receiverId, message, files } = data;

      // Emit to receiver's private room
      io.to(receiverId).emit("newMessage", {
        senderId: socket.userId,
        receiverId,
        message,
        files,
        timestamp: new Date(),
      });

      // Also emit to sender for confirmation
      socket.emit("messageSent", {
        receiverId,
        message,
        files,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error("Error sending message via socket:", error);
      socket.emit("messageError", { error: error.message });
    }
  });

  // NEW_NOTIFICATION event - for future notification system
  socket.on("sendNotification", async (data) => {
    try {
      const { receiverId, notification } = data;

      // Emit to receiver's private room
      io.to(receiverId).emit("newNotification", {
        ...notification,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error("Error sending notification via socket:", error);
    }
  });

  // TASK_ASSIGNED event
  socket.on("taskAssigned", async (data) => {
    try {
      const { receiverId, task } = data;

      io.to(receiverId).emit("taskAssigned", {
        task,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error("Error sending task assigned event:", error);
    }
  });

  // TASK_ACCEPTED event
  socket.on("taskAccepted", async (data) => {
    try {
      const { receiverId, task } = data;

      io.to(receiverId).emit("taskAccepted", {
        task,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error("Error sending task accepted event:", error);
    }
  });

  // SOLUTION_SUBMITTED event
  socket.on("solutionSubmitted", async (data) => {
    try {
      const { receiverId, solution } = data;

      io.to(receiverId).emit("solutionSubmitted", {
        solution,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error("Error sending solution submitted event:", error);
    }
  });

  // SOLUTION_APPROVED event
  socket.on("solutionApproved", async (data) => {
    try {
      const { receiverId, solution } = data;

      io.to(receiverId).emit("solutionApproved", {
        solution,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error("Error sending solution approved event:", error);
    }
  });

  // SOLUTION_REWORK event
  socket.on("solutionRework", async (data) => {
    try {
      const { receiverId, solution } = data;

      io.to(receiverId).emit("solutionRework", {
        solution,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error("Error sending solution rework event:", error);
    }
  });

  // EOD_SUBMITTED event
  socket.on("eodSubmitted", async (data) => {
    try {
      const { receiverId, eod } = data;

      io.to(receiverId).emit("eodSubmitted", {
        eod,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error("Error sending EOD submitted event:", error);
    }
  });

  // TASK_STATUS_UPDATED event
  socket.on("taskStatusUpdated", async (data) => {
    try {
      const { receiverId, task } = data;

      io.to(receiverId).emit("taskStatusUpdated", {
        task,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error("Error sending task status updated event:", error);
    }
  });

  // Typing indicator
  socket.on("typing", (data) => {
    const { receiverId } = data;
    io.to(receiverId).emit("userTyping", {
      userId: socket.userId,
    });
  });

  socket.on("stopTyping", (data) => {
    const { receiverId } = data;
    io.to(receiverId).emit("userStoppedTyping", {
      userId: socket.userId,
    });
  });

  // Join specific room (for future use)
  socket.on("joinRoom", (roomName) => {
    socket.join(roomName);
    console.log(`User ${socket.userId} joined room: ${roomName}`);
  });

  // Leave specific room
  socket.on("leaveRoom", (roomName) => {
    socket.leave(roomName);
    console.log(`User ${socket.userId} left room: ${roomName}`);
  });
};
