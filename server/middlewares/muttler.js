import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

export const connectCloudinary = async()=>{
    try {
        await cloudinary.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.CLOUD_KEY,
            api_secret: process.env.CLOUD_SECRET
        })
    } catch (error) {
        console.log(error)
    }
}

const storage = multer.diskStorage({
    destination:'uploads',
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

export const upload = multer({storage})