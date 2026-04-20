import { v2 as cloudinary } from 'cloudinary'

export default defineEventHandler(async (event) => {
  const body = await readMultipartFormData(event)

  const file = body?.find(item => item.name === 'file')

  if (!file) {
    throw createError({
      statusCode: 400,
      statusMessage: 'File tidak ditemukan'
    })
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  })

  const upload: any = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder: "pramuka" },
      (error, result) => {
        if (error) reject(error)
        else resolve(result)
      }
    ).end(file.data)
  })

  return {
    url: upload.secure_url,
    public_id: upload.public_id
  }
})