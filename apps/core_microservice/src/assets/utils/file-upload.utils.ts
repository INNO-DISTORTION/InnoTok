import { HttpException, HttpStatus } from '@nestjs/common';
import { extname } from 'path';
import { FileFilterCallback, DiskStorageCallback } from './file-upload.types';

const ALLOWED_FILE_EXTENSIONS_REGEX = /\.(jpg|jpeg|png|gif|mp4|mov|avi|mkv)$/;

export const imageAndVideoFileFilter = (
  _req: unknown,
  file: Express.Multer.File,
  callback: FileFilterCallback,
) => {
  // Regular expression for checking valid file formats
  if (!file.originalname.match(ALLOWED_FILE_EXTENSIONS_REGEX)) {
    return callback(
      new HttpException(
        'Only image and video files are allowed',
        HttpStatus.BAD_REQUEST,
      ),
      false,
    );
  }
  callback(null, true);
};
// Function to generate a unique file name before saving it to the server
export const editFileName = (
  _req: unknown,
  file: Express.Multer.File,
  callback: DiskStorageCallback,
) => {
  const fileExtName = extname(file.originalname);
  const randomName = Array(32)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  callback(null, `${randomName}${fileExtName}`);
};
