import { resolve } from 'path';
import fs from 'fs';
import aws from 'aws-sdk';

import AdminProfileImage from '../models/AdminProfileImage';

class AdminProfileImageController {
  async show(req, res) {
    const { user_id } = req.params;

    const image = await AdminProfileImage.findOne({ where: { user_id } });

    if (!image) {
      return res
        .status(400)
        .json({ message: 'This user does not have a profile image' });
    }

    return res.json(image);
  }

  async store(req, res) {
    const defaultURL = `${process.env.APP_URL}/uploads/admin-profile-images/${req.file.filename}`;

    const { key: name, location: url = defaultURL } = req.file;
    const { user_id } = req.params;

    // Delete image from storage and database if user already have profile image

    const profileImage = await AdminProfileImage.findOne({
      where: { user_id },
    });

    if (profileImage && process.env.STORAGE_TYPE === 'local') {
      const path = resolve(
        __dirname,
        '..',
        '..',
        '..',
        'uploads',
        'admin-profile-images',
        profileImage.name
      );

      try {
        fs.unlinkSync(path);
      } catch (err) {
        return res.json(err);
      }

      await AdminProfileImage.destroy({ where: { id: profileImage.id } });
    }

    if (profileImage && process.env.STORAGE_TYPE === 's3') {
      const s3 = new aws.S3();

      await s3.deleteObjects(
        {
          Bucket: process.env.S3_IMAGES_BUCKET,
          Delete: {
            Objects: [
              {
                Key: `admin-profile-images/${profileImage.name}`,
              },
            ],
          },
        },
        async function(err, data) { /* eslint-disable-line */
          if (err) {
            // ERROR DELETING
            console.log(err, err.stack); /* eslint-disable-line */
          } else {
            // SUCCESSFUL DELETED IMAGE, so we can clear database
          }
        }
      );

      await AdminProfileImage.destroy({ where: { id: profileImage.id } });
    }

    // Add to database if does not have one already

    const image = await AdminProfileImage.create({
      name,
      url,
      user_id,
    });

    return res.json(image);
  }

  async delete(req, res) {
    const { user_id } = req.params;
    const image = await AdminProfileImage.findOne({ where: { user_id } });

    if (!image) {
      return res.status(400).json({ message: 'Profile Image not found' });
    }

    await image.destroy();

    return res.json({ message: 'Image successfully deleted' });
  }
}

export default new AdminProfileImageController();
