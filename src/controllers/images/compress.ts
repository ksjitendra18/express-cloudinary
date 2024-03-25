import type { Request, Response } from "express";
import sharp from "sharp";
import fs from "node:fs";
import uploadService from "../../services/upload";

const compress = async (req: Request, res: Response) => {
  const bunnyCDNApiKey = "4e48c731-a44e-4c41-88ddaeec89bc-bc82-4ee1";
  const storageZoneName = "optimize-serve-dev";
  const storageZonePath = "compress";

  try {
    const inputFile = req.file?.path;

    const metadata = await sharp(inputFile).metadata();

    console.log("metadata", metadata);

    if (metadata.format === "png") {
      const compressedImg = await sharp(inputFile)
        .png({ quality: 80 })
        .toBuffer();

      const fileName = `${req?.file?.filename.split(".")[0]}.png`;

      try {
        const data = await uploadService({ compressedImg, fileName });

        if (data instanceof Error) {
          return res.json({
            success: false,
            error: "upload_error",
            message: "Image uploaded successfully",
          });
        } else {
          return res.json({
            success: true,
            data: { downloadUrl: data.downloadUrl, newSize: data.newSize },
            message: "Image uploaded successfully",
          });
        }
      } catch (error) {
        return res.json({
          success: false,
          error: "upload_error",
          message: "Image uploaded successfully",
        });
      } finally {
        console.log("in finally");
        if (inputFile) {
          fs.unlinkSync(inputFile);
        }
      }
    }

    if (metadata.format === "webp") {
      const fileName = `${req?.file?.filename.split(".")[0]}.webp`;

      const compressedImg = await sharp(inputFile)
        .webp({ lossless: true })
        .toBuffer();

      try {
        const data = await uploadService({ compressedImg, fileName });

        if (data instanceof Error) {
          return res.json({
            success: false,
            error: "upload_error",
            message: "Image uploaded successfully",
          });
        } else {
          return res.json({
            success: true,
            data: { downloadUrl: data.downloadUrl, newSize: data.newSize },
            message: "Image uploaded successfully",
          });
        }
      } catch (error) {
        return res.json({
          success: false,
          error: "upload_error",
          message: "Image uploaded successfully",
        });
      } finally {
        if (inputFile) {
          fs.unlinkSync(inputFile);
        }
      }
    }
  } catch (e) {
    console.log("error while uploading", e);
    res.status(500).json({ success: false, message: { e } });
  } finally {
    console.log("in finally");
  }
};

export default compress;
