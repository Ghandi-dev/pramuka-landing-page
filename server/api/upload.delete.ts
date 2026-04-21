import { v2 as cloudinary } from 'cloudinary'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { imageUrl } = body

  if (!imageUrl) {
    throw createError({
      statusCode: 400,
      statusMessage: 'URL gambar tidak disertakan'
    })
  }

  // Ekstrak public_id dari cloudinary URL
  // Contoh: https://res.cloudinary.com/cloud_name/image/upload/v12345/folder/filename.png
  try {
    const parts = imageUrl.split('/')
    const uploadIndex = parts.indexOf('upload')
    
    if (uploadIndex === -1) {
       // Bukan URL cloudinary yang dapat kita tangani formatnya
       return { success: false, message: 'Bukan URL Cloudinary yang valid' }
    }
    
    // Asumsi public_id adalah segala sesuatu setelah "/upload/[vXXX]/" dan tanpa ekstensi
    // Version (vXXX) itu opsional, tapi biasanya selalu ada. Mari kita periksa:
    let publicIdPart = parts.slice(uploadIndex + 1)
    
    if (publicIdPart[0].startsWith('v') && !isNaN(parseInt(publicIdPart[0].substring(1)))) {
       // Abaikan vXXXX portion
       publicIdPart.shift()
    }
    
    const publicIdWithExtension = publicIdPart.join('/')
    const lastDotIndex = publicIdWithExtension.lastIndexOf('.')
    
    let publicId = publicIdWithExtension
    if (lastDotIndex !== -1) {
       publicId = publicId.substring(0, lastDotIndex)
    }

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    })

    const result = await cloudinary.uploader.destroy(publicId)
    
    return {
      success: true,
      result
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Gagal menghapus gambar'
    })
  }
})
