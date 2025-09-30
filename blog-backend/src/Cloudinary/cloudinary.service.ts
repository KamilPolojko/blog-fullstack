import { Inject, Injectable } from '@nestjs/common';
import { v2 as cloudinarySdk } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor(@Inject('CLOUDINARY') private cloudinary: typeof cloudinarySdk) {}

  async deleteFromCloudinary(publicId: string): Promise<void> {
    await this.cloudinary.uploader.destroy(publicId);
  }

  async uploadImageToCloudinary(
    file: Express.Multer.File,
  ): Promise<{ url: string; public_id: string }> {
    return new Promise((resolve, reject) => {
      const stream = this.cloudinary.uploader.upload_stream(
        { resource_type: 'image' },
        (error, result) => {
          if (error || !result)
            return reject(error || new Error('No result from Cloudinary'));
          resolve({ url: result.secure_url, public_id: result.public_id });
        },
      );
      stream.end(file.buffer);
    });
  }
}
