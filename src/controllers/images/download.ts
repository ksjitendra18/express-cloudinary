import { Request, Response } from "express";
// import fetch from "node-fetch";
import axios from "axios";

const download = async (req: Request, res: Response) => {
  const [downloadUrl, fileName] = atob(req.params.id).split("&oz_fn=");

  console.log("downloadUrl", downloadUrl);
  //   const response = await fetch(downloadUrl);

  const response = await axios({
    url: downloadUrl,
    method: "GET",
    responseType: "stream",
  });
  console.log("response", response.headers);

  res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
  res.setHeader("Content-Type", "application/octet-stream");

  return response.data.pipe(res);
};

export default download;
