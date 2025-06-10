import express, { Express } from "express";
import connectDB from "./config/db";
import authRoutes from "./routes/auth.routes";

const app: Express = express();
const port = 3000;

app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

