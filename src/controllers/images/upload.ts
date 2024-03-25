import type { Request, Response } from "express";
import sharp from "sharp";
import fs from "node:fs";
import uploadService from "../../services/upload";
import { db } from "../../lib/db";
import { files, folders } from "../../lib/db/schema";
import slugify from "slugify";
import compressImgService from "../../services/compress-img";

import { createId } from "@paralleldrive/cuid2";

const uploadImg = async (req: Request, res: Response) => {
  const bunnyCDNApiKey = "4e48c731-a44e-4c41-88ddaeec89bc-bc82-4ee1";
  const storageZoneName = "optimize-serve-dev";
  const storageZonePath = "compress";

  try {
    const inputFile = req.file;

    if (!inputFile) {
      return res.json({ error: "no_file" }).status(400);
    }

    const mimeType = inputFile.mimetype;

    const { folderId } = req.body;

    const id = createId();

    

    const inputImage = await sharp(inputFile.path).toBuffer();

    const metadata = await sharp(inputFile.path).metadata();

    const uploadUrl = `https://storage.bunnycdn.com/${storageZoneName}/${storageZonePath}/${req
      .file?.filename!}`;

    const uploadRes = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        AccessKey: bunnyCDNApiKey,
        "Content-Type": metadata.format ?? "application/octect-stream",
      },
      body: inputImage,
    });

    const resData = await uploadRes.json();

    if (resData.HttpCode === 201) {
      if (mimeType.startsWith("image")) {
      }
      await db.insert(files).values({
        id,
        name: req.file?.originalname!,
        slug: slugify(req.file?.filename!, {
          lower: true,
        }),
        isChild: false,
        mimeType,
        size: inputFile.size,
        folderId: folderId,
      });

      compressImgService({ inputFile: inputFile.path, fileName: id, folderId });

      return res.status(200).json({ success: true });
    } else {
      return res.status(500).json({ error: "server_error" });
    }
  } catch (err) {
    console.log("error while upload", err);

    return res.status(500).json({ error: "server_error" });
  }
};

export default uploadImg;
