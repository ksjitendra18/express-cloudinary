import type { Request, Response } from "express";
import sharp from "sharp";
import fs from "node:fs";
import uploadService from "../../services/upload";
import { db } from "../../lib/db";
import { allowedFiles, files, folders, projects } from "../../lib/db/schema";
import slugify from "slugify";
import compressImgService from "../../services/compress-img";
import axios from "axios";
import { createId } from "@paralleldrive/cuid2";
import { eq } from "drizzle-orm";

const uploadImg = async (req: Request, res: Response) => {
  const bunnyCDNApiKey = "4e48c731-a44e-4c41-88ddaeec89bc-bc82-4ee1";
  const storageZoneName = "optimize-serve-dev";
  const storageZonePath = "compress";

  try {
    const inputFile = req.file;
    const { folderId, projectId } = req.body;

    const projectInfo = await db.query.projects.findFirst({
      where: eq(projects.id, projectId),
    });

    if (!projectInfo) {
      return res.status(200).json({
        error: "not_exist",
        message: "Project does not exists",
      });
    }

    const allowedMimetypes = await db.query.allowedFiles.findFirst({
      where: eq(allowedFiles.projectsId, projectInfo.id),
    });

    console.log("allowedMimeTypes", allowedMimetypes);

    if (!inputFile || !allowedMimetypes) {
      return res.json({ error: "no_file" }).status(400);
    }

    const mimeType = inputFile.mimetype;

    console.log("mimetype", mimeType);

    if (mimeType === "application/pdf" && !allowedMimetypes.pdf) {
      return res.status(415).json({ error: "not_allowed" });
    }
    if (mimeType.startsWith("audio") && !allowedMimetypes.audio) {
      return res.status(415).json({ error: "not_allowed" });
    }
    if (mimeType.startsWith("application") && !allowedMimetypes.apps) {
      return res.status(415).json({ error: "not_allowed" });
    }

    const id = createId();

    if (mimeType.startsWith("image")) {
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
          dimensions: `${metadata.width}x${metadata.height}`,
          size: inputFile.size,
          folderId: folderId,
        });

        compressImgService({
          inputFile: inputFile.path,
          fileName: id,
          folderId,
        });

        return res.status(200).json({ success: true });
      } else {
        return res.status(500).json({ error: "server_error" });
      }
    } else {
      const uploadUrl = `https://storage.bunnycdn.com/${storageZoneName}/${storageZonePath}/${req
        .file?.filename!}`;

      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          AccessKey: bunnyCDNApiKey,
          "Content-Type": mimeType,
        },
        body: fs.readFileSync(inputFile.path),
      });
      // "Content-Type": inputFile.mimetype ?? "application/octect-stream",

      const resData = await uploadRes.json();

      console.log("resData", mimeType, resData);

      if (resData.HttpCode === 201) {
        await db.insert(files).values({
          id,
          name: req.file?.originalname!,
          slug: slugify(req.file?.filename!, {
            lower: true,
          }),
          isChild: false,
          mimeType,
          size: inputFile.size,
          folderId,
        });

        console.log("path,", inputFile.path);

        fs.unlink(inputFile.path, (err) => {
          if (err) {
            console.log("unable to delete file 😒");
          }
          console.log("file delete 🔥");
        });
        return res.status(200).json({ success: true });
      } else {
        return res.status(500).json({ error: "server_error" });
      }
    }
  } catch (err) {
    console.log("error while upload", err);

    return res.status(500).json({ error: "server_error" });
  }
};

export default uploadImg;
