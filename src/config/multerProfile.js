import multer from 'multer';
import { resolve } from 'path';
import fs from 'fs';
import aws from 'aws-sdk';
import multerS3 from 'multer-s3';

const storageTypes = {
  local: multer.diskStorage({
    destination: (req, file, cb) => {
      const dir =
        process.env.NODE_ENV === 'test'
          ? resolve(__dirname, '..', '..', '__tests__', 'imgs-profile')
          : resolve(__dirname, '..', '..', 'uploads', 'profile');

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      file.key = `${Date.now().toString()}-${file.originalname}`;

      return cb(null, file.key);
    },
  }),
  s3: multerS3({
    s3: new aws.S3(),
    bucket: 'pauleiraimages/profile',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: 'public-read',
    key: (req, file, cb) => {
      file.key = `${Date.now().toString()}-user-${req.params.user_id}`;

      return cb(null, file.key);
    },
  }),
};

export default {
  storage: storageTypes[process.env.STORAGE_TYPE],
  limits: {
    fileSize: 2 * 1024 * 1024,
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
