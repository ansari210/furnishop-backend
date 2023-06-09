// import "dotenv/config";
import cors from "cors";
import dotenv from "dotenv";
import bedRoutes from "./routes/beds";
import iconRoutes from "./routes/icons";
import express, { Express } from "express";
import databaseConnect from "./config/database";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth";
import paymentRoutes from "./routes/payment";
import userRoutes from "./routes/user";
import reviews from "./routes/reviews";
import orderRoutes from "./routes/order";
import bedsRoutes from "./routes/fileroutes";
import reviewsRoutes from "./routes/reviews";
import headboardRoutes from "./routes/headboard";
import couponsRoutes from "./routes/coupon";
import merchantRoutes from "./routes/merchant";
import blogsRoutes from "./routes/blogs";
import collectionRoutes from "./routes/collection";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import {
  createActiveUser,
  findActiveUserByOrderId,
  getActiveUserBySocketId,
  removeActiveUser,
  reomveOrderIdBySocketId,
  updateUserOrderIdBySocketId,
} from "./services/socket-services";
import { getOrderByIdService } from "./services/order-services";

dotenv.config();

dotenv.config({
  path: `.env`,
  override: true,
});
// INITIALIZING EXPREESS
const app: Express = express();
const server = createServer(app);
const port = process.env.PORT;
databaseConnect();

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// MIDDLEWARES
app.disable("x-powered-by");
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.ALLOWED_DOMAINS?.split(" "),
    optionsSuccessStatus: 200,
  })
);

//Make socket.io available to our router
app.use((req, res, next) => {
  req.io = io;
  next();
});

//IMAGE ROUTE

app.use("/api/beds-image", express.static("dist/uploads/beds"));
app.use("/api/icons-image", express.static("dist/uploads/icons"));

//ROUTES
// app.get("/api", async (req, res) => {
//   try {
//     const data = await listProductItems();
//     console.log(data);
//     res.status(200).json(data.data);
//   } catch (error) {
//     res.status(500).json(error);
//   }
// });

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/beds", bedRoutes);
app.use("/api/icons", iconRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/headboard", headboardRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/bedsMultiple", bedsRoutes);
app.use("/api/reviews", reviews);
app.use("/api/coupons", couponsRoutes);
app.use("/api/google-merchant", merchantRoutes);
app.use("/api/collection",collectionRoutes);

// Create Blogs
app.use("/api/blogs", blogsRoutes);

// PORT LISTEN
server.listen(port, () => {
  console.log(`Server Runnig http://localhost:${port}`);
});

const activeUsers: IActiveUser[] = [];

io.on("connection", (socket: Socket) => {
  socket.once("active", async () => {
    const findActiveUser = await getActiveUserBySocketId(
      activeUsers,
      socket.id
    );
    if (findActiveUser) return;
    await createActiveUser(activeUsers, {
      socketId: socket.id,
    });
  });

  socket.on("test", async () => {
    const findActiveUser = await getActiveUserBySocketId(
      activeUsers,
      socket.id
    );
    io.emit("test", findActiveUser);
  });

  socket.on("active-order", async (orderId, name) => {
    if (!orderId) return;
    const findAlreadyActiveUser = await findActiveUserByOrderId(
      activeUsers,
      orderId
    );

    if (!findAlreadyActiveUser) {
      await updateUserOrderIdBySocketId(activeUsers, socket.id, orderId, name);
    }

    console.log({ name, test: findAlreadyActiveUser?.name, orderId });

    socket.emit("is-order-accessible", {
      name: findAlreadyActiveUser?.name,
      access: findAlreadyActiveUser ? false : true,
    });
  });

  socket.on("inactive-order", async (orderId) => {
    if (!orderId) return;
    reomveOrderIdBySocketId(activeUsers, socket.id);
  });

  socket.on("order", async (orderId) => {
    if (!orderId) return;

    const order = await getOrderByIdService(orderId);

    if (!order) {
      await updateUserOrderIdBySocketId(activeUsers, socket.id, orderId);
    }

    socket.emit("order", {
      order,
    });
  });

  socket.on("disconnect", () => {
    removeActiveUser(activeUsers, socket.id);
  });
});

app.get("/active", async (req, res) => {
  res.status(200).json({ activeUsers });
});
