import fs from "node:fs";
import sharp from "sharp";
import uploadService from "./upload";
import { db } from "../lib/db";
import { files } from "../lib/db/schema";
import { createId } from "@paralleldrive/cuid2";
import slugify from "slugify";

const compressImgService = async ({
  inputFile,
  fileName,
  folderId,
}: {
  inputFile: string;
  fileName: string;
  folderId: string;
}) => {
  console.log("image service in progress");
  console.time("cis");
  const metadata = await sharp(inputFile).metadata();

  console.log("metadata", metadata);

  if (metadata.format === "png") {
    const compressedImg = await sharp(inputFile)
      .png({ quality: 80 })
      .toBuffer();

    await uploadService({ compressedImg, fileName: `${fileName}__oz__.png` });

    const id = createId();

    await db.insert(files).values({
      id,
      name: `${fileName}__oz__.png`,
      slug: slugify(`${fileName}__oz__.png`, {
        lower: true,
      }),
      isChild: true,
      mimeType: `image/${metadata.format}`,
      dimensions: `${metadata.width}x${metadata.height}`,
      size: compressedImg.byteLength,
      folderId: folderId,
    });
  }
  if (metadata.format === "jpg" || metadata.format === "jpeg") {
    const compressedImg = await sharp(inputFile)
      .jpeg({ quality: 80 })
      .toBuffer();

    uploadService({ compressedImg, fileName: `${fileName}__oz__.jpeg` });

    const id = createId();

    await db.insert(files).values({
      id,
      name: `${fileName}__oz__.jpeg`,
      slug: slugify(`${fileName}__oz__.jpeg`, {
        lower: true,
      }),
      isChild: true,
      mimeType: `image/${metadata.format}`,
      dimensions: `${metadata.width}x${metadata.height}`,
      size: compressedImg.byteLength,
      folderId: folderId,
    });
  }

  const compressedWebp = await sharp(inputFile)
    .webp({ lossless: true })
    .toBuffer();

  await uploadService({
    compressedImg: compressedWebp,
    fileName: `${fileName}__oz__.webp`,
  });

  const id = createId();

  await db.insert(files).values({
    id,
    name: `${fileName}__oz__.webp`,
    slug: slugify(`${fileName}__oz__.webp`, {
      lower: true,
    }),
    isChild: true,
    size: compressedWebp.byteLength,
    mimeType: `image/${metadata.format}`,
    dimensions: `${metadata.width}x${metadata.height}`,
    folderId: folderId,
  });

  const compressedAvif = await sharp(inputFile)
    .avif({ lossless: true })
    .resize()
    .toBuffer();

  await uploadService({
    compressedImg: compressedAvif,
    fileName: `${fileName}__oz__.avif`,
  });

  console.log("converting to avif....");
  const avifId = createId();

  const res = await db.insert(files).values({
    id: avifId,
    name: `${fileName}__oz__.avif`,
    slug: slugify(`${fileName}__oz__.avif`, {
      lower: true,
    }),
    isChild: true,
    mimeType: `image/${metadata.format}`,
    dimensions: `${metadata.width}x${metadata.height}`,
    size: compressedAvif.byteLength,
    folderId: folderId,
  });

  console.log("done", compressedAvif.byteLength, res);

  fs.unlink(inputFile, (err) => {
    console.log("error while deleting", err);
  });

  console.log("image service done");
  console.timeEnd("cis");
};

export default compressImgService;
