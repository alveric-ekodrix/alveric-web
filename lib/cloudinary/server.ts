import { v2 as cloudinary } from 'cloudinary';

export function getCloudinaryClient() {
  const cloud_name = (
    process.env.CLOUDINARY_CLOUD_NAME ||
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
    'jdmhecda'
  ).trim().replace(/^["']|["']$/g, '');

  const api_key = (
    process.env.CLOUDINARY_API_KEY ||
    '537499214413269'
  ).trim().replace(/^["']|["']$/g, '');

  const api_secret = (
    process.env.CLOUDINARY_API_SECRET ||
    'dnEQqS2CiPR3pMqaHtoK9WuBRiw'
  ).trim().replace(/^["']|["']$/g, '');

  cloudinary.config({
    cloud_name,
    api_key,
    api_secret,
    secure: true,
  });

  return cloudinary;
}

export { cloudinary };

export async function uploadBufferToCloudinary(
  buffer: Buffer,
  folder: string = 'alveric'
): Promise<{
  success: boolean;
  public_id?: string;
  secure_url?: string;
  width?: number;
  height?: number;
  resource_type?: string;
  error?: string;
}> {
  const client = getCloudinaryClient();

  return new Promise((resolve) => {
    const uploadStream = client.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto',
      },
      (error, result) => {
        if (error || !result) {
          console.error('Cloudinary buffer stream upload error:', error);
          const detail =
            error?.message ||
            (error as any)?.error?.message ||
            (typeof error === 'string' ? error : JSON.stringify(error));
          resolve({
            success: false,
            error: detail || 'Failed to upload to Cloudinary',
          });
        } else {
          resolve({
            success: true,
            public_id: result.public_id,
            secure_url: result.secure_url,
            width: result.width,
            height: result.height,
            resource_type: result.resource_type,
          });
        }
      }
    );

    uploadStream.end(buffer);
  });
}

export async function uploadImageToCloudinary(
  fileBase64OrUrl: string,
  folder: string = 'alveric'
) {
  try {
    const client = getCloudinaryClient();
    const result = await client.uploader.upload(fileBase64OrUrl, {
      folder,
      resource_type: 'auto',
    });

    return {
      success: true,
      public_id: result.public_id,
      secure_url: result.secure_url,
      width: result.width,
      height: result.height,
      resource_type: result.resource_type,
    };
  } catch (error: any) {
    console.error('Cloudinary upload error:', error);
    const detail =
      error?.message ||
      error?.error?.message ||
      (typeof error === 'string' ? error : JSON.stringify(error));
    return {
      success: false,
      error: detail || 'Failed to upload to Cloudinary',
    };
  }
}

export async function deleteImageFromCloudinary(publicId: string) {
  try {
    const client = getCloudinaryClient();
    const result = await client.uploader.destroy(publicId);
    return { success: result.result === 'ok' };
  } catch (error: any) {
    console.error('Cloudinary delete error:', error);
    return { success: false, error: error?.message || 'Failed to delete from Cloudinary' };
  }
}
