import multer from 'multer';
import { resolve } from 'path';
import fs from 'fs';
import aws from 'aws-sdk';
import multerS3 from 'multer-s3';

const storageTypes = {
  local: multer.diskStorage({
    destination: (req, file, cb) => {
      const baseDir = resolve(
        __dirname,
        '..',
        '..',
        'uploads',
        'admin-galleries'
      );

      const dir =
        process.env.NODE_ENV === 'test'
          ? resolve(
              __dirname,
              '..',
              '..',
              '__tests__',
              'imgs-gallery',
              req.params.gallery_id
            )
          : resolve(baseDir, req.params.gallery_id);

      if (!fs.existsSync(baseDir)) {
        fs.mkdirSync(baseDir);
      }

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }

      cb(null, dir);
    },
    filename: (req, file, cb) => {
      const sanitizedName = file.originalname.replace(/\s/g, '-');

      file.key = `${Date.now().toString()}-${sanitizedName}`;

      return cb(null, file.key);
    },
  }),

  s3: multerS3({
    s3: new aws.S3(),
    bucket: (req, file, cb) => {
      const bucketFolder = `${process.env.S3_IMAGES_BUCKET}/admin-galleries/${req.params.gallery_id}`;

      return cb(null, bucketFolder);
    },
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: 'public-read',
    key: (req, file, cb) => {
      const sanitizedName = file.originalname.replace(/\s/g, '_');

      const fileName = `${Date.now().toString()}_${sanitizedName}`;

      return cb(null, fileName);
    },
  }),
};

export default {
  storage: storageTypes[process.env.STORAGE_TYPE],
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid File Type'));
    }
  },
};
