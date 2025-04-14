const { createServer } = require("http");
const { Server } = require("socket.io");
const config = require("./config/config");
const { initializeDatabase, sequelize } = require("./models");
const app = require("./app");
const { logger } = require("./utils/logger");

const PORT = config.port || 3000;

// Global error handlers
process.on("uncaughtException", (error) => {
  console.error("\n=== Uncaught Exception ===");
  console.error("Error:", error);
  console.error("Stack:", error.stack);
  console.error("==================\n");

  logger.error("Uncaught Exception", {
    error: error.message,
    stack: error.stack,
  });

  // Don't exit immediately, give time to log
  setTimeout(() => {
    process.exit(1);
  }, 1000);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("\n=== Unhandled Rejection ===");
  console.error("Reason:", reason);
  console.error("Promise:", promise);
  console.error("==================\n");

  logger.error("Unhandled Rejection", {
    reason: reason instanceof Error ? reason.message : reason,
    stack: reason instanceof Error ? reason.stack : undefined,
  });
});

// Create HTTP server
const httpServer = createServer(app);

// Error handler for HTTP server
httpServer.on("error", (error) => {
  console.error("\n=== HTTP Server Error ===");
  console.error("Error:", error);
  console.error("Stack:", error.stack);
  console.error("==================\n");

  logger.error("HTTP Server Error", {
    error: error.message,
    stack: error.stack,
  });
});

// Configure Socket.IO with security settings
const io = new Server(httpServer, {
  cors: {
    origin:
      process.env.NODE_ENV === "production"
        ? ["https://smartvyapar.com", "https://www.smartvyapar.com"]
        : ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST"],
    credentials: true,
  },
  pingTimeout: 60000,
  pingInterval: 25000,
  maxHttpBufferSize: 1e6, // 1MB
  connectTimeout: 45000,
  transports: ["websocket", "polling"],
  allowEIO3: true,
});

// Socket.IO connection handling
io.on("connection", (socket) => {
  const clientIp = socket.handshake.address;
  logger.info("New socket connection", { socketId: socket.id, clientIp });

  socket.on("disconnect", (reason) => {
    logger.info("Socket disconnected", { socketId: socket.id, reason });
  });

  socket.on("error", (error) => {
    console.error("\n=== Socket Error ===");
    console.error("Socket ID:", socket.id);
    console.error("Error:", error);
    console.error("==================\n");

    logger.error("Socket error", { socketId: socket.id, error });
  });
});

// Start the server first
const server = httpServer.listen(PORT, async () => {
  logger.info("Server started", { port: PORT });

  // After server is running, initialize database using the existing function
  try {
    await initializeDatabase();
    logger.info("Database initialized successfully");
  } catch (error) {
    logger.error("Database initialization failed", { error: error.message });
    process.exit(1);
  }
});

// Graceful shutdown
process.on("SIGTERM", () => {
  logger.info("SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    logger.info("Server closed");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  logger.info("SIGINT received. Shutting down gracefully...");
  server.close(() => {
    logger.info("Server closed");
    process.exit(0);
  });
});

module.exports = { server, io };
