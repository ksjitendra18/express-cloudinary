import { Request, Response } from "express";
import fs from "fs";
import cloudinary from "cloudinary";

export const register = async (req: Request, res: Response) => {
  const inputFile = req.file!.path;

  const { name } = req.body;

  cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  console.log("name", name);
  console.log("input file", inputFile);

  try {
    const cloudinaryRes = await cloudinary.v2.uploader.upload(inputFile);
    console.log("cloudinaryRes", cloudinaryRes);

    if (cloudinaryRes && cloudinaryRes.secure_url) {
      return res.json({ success: true, url: cloudinaryRes.secure_url });
    } else {
      return res.json({ success: false });
    }
  } catch (error) {
    console.log("error while uploading", error);
    return res.json({ success: false });
  } finally {
    fs.unlinkSync(inputFile);
  }
};
