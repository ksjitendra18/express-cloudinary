import cors from "cors";
import dotenv from "dotenv";
import express, { Router } from "express";
import multer from "multer";
import path from "node:path";
import compress from "../controllers/images/compress";
import download from "../controllers/images/download";
import uploadImg from "../controllers/images/upload";
import { createId } from "@paralleldrive/cuid2";

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    console.log("original name", file.originalname);
    // const uniqueSuffix = `${
    //   path.parse(file.originalname).name
    // }__oz-img__-${Math.round(Math.random() * 1e4)}`;

    const uniqueSuffix = createId();
    const fileExtension = path.extname(file.originalname);
    cb(null, uniqueSuffix + fileExtension);
  },
});
const upload = multer({ storage });

const imagesRoutes = Router();

imagesRoutes.post("/compress", upload.single("image"), compress);
imagesRoutes.get("/download/:id", download);
imagesRoutes.post("/upload", upload.single("image"), uploadImg);

export default imagesRoutes;
