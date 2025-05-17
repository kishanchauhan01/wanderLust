import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    //upload Localfile on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: "wanderlust",
    });
    //file has been uploaded successfully
    // console.log("File is uploaded on cloudinary...", response.url);

    const tempFilename = response.public_id.split("/").pop(); // "abc123xyz"
    const extension = response.format; // "jpg", "png", etc.
    const fullFilename = `${tempFilename}.${extension}`;

    fs.unlinkSync(localFilePath);
    return { ...response, filename: fullFilename };
  } catch (error) {
    fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload operation got failed
    return null;
  }
};

const deleteFromCloudinary = async (public_id) => {
  try {
    if (!public_id) return null;

    const response = await cloudinary.uploader.destroy(public_id, {
      resource_type: "image",
    });

    // Optional: check result status
    if (response.result === "ok") {
      return response;
    } else {
      console.warn("Cloudinary deletion failed:", response);
      return null;
    }
  } catch (error) {
    console.error("Cloudinary deletion error:", error);
    return null;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
