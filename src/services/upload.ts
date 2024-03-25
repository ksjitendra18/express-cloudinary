const uploadService = async ({
  compressedImg,
  fileName,
}: {
  compressedImg: Buffer;
  fileName: string;
}) => {
  const bunnyCDNApiKey = "4e48c731-a44e-4c41-88ddaeec89bc-bc82-4ee1";
  const storageZoneName = "optimize-serve-dev";
  const storageZonePath = "compress";

  const pngCompressUrl = `https://storage.bunnycdn.com/${storageZoneName}/${storageZonePath}/${fileName}`;
  const uploadRes = await fetch(pngCompressUrl, {
    method: "PUT",
    headers: {
      AccessKey: bunnyCDNApiKey,
      "Content-Type": "image/png",
    },
    body: compressedImg,
  });

  const resData = await uploadRes.json();

  if (resData.HttpCode === 201) {
    const downloadUrl = `https://ozserver-v1.b-cdn.net/compress/${fileName}&oz_fn=${fileName}`;
    return {
      downloadUrl: btoa(downloadUrl),
      newSize: compressedImg.byteLength,
    };
  } else {
    return new Error("Error while uploading");
  }
};

export default uploadService;
