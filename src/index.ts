import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import imagesRoutes from "./routes/images";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

app.use("/v1", imagesRoutes);

app.listen(8080, () => {
  console.log("App running on 8080");
});
