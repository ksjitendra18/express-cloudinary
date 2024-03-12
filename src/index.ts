import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import multer from "multer";
import path from "path";

import { register } from "./user.controller";

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    console.log("original name", file.originalname);
    const uniqueSuffix =
      path.parse(file.originalname).name +
      "-" +
      Math.round(Math.random() * 1e4);
    const fileExtension = path.extname(file.originalname);
    cb(null, uniqueSuffix + fileExtension);
  },
});
const upload = multer({ storage });

const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();

app.post("/register", upload.single("image"), register);

app.listen(3000, () => {
  console.log("App running on 3000");
});
