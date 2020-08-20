import { resolve } from 'path';
import del from 'del';
import aws from 'aws-sdk';

import AdminGallery from '../models/AdminGallery';
import AdminGalleryImage from '../models/AdminGalleryImage';
import AdminUser from '../models/AdminUser';

const s3 = new aws.S3();

class AdminGalleryController {
  async index(req, res) {
    const response = await AdminGallery.findAll({
      include: [
        {
          model: AdminUser,
          as: 'user',
          attributes: ['name'],
        },
        {
          model: AdminGalleryImage,
          as: 'images',
        },
      ],
    });

    return res.json(response);
  }

  async show(req, res) {
    const gallery = await AdminGallery.findByPk(req.params.id, {
      include: [
        {
          model: AdminUser,
          as: 'user',
          attributes: ['name'],
        },
        {
          model: AdminGalleryImage,
          as: 'images',
        },
      ],
    });

    if (!gallery) {
      return res.json({ message: 'Gallery not found or does not exixts' });
    }

    return res.json(gallery);
  }

  async store(req, res) {
    const gallery = await AdminGallery.create(req.body);

    return res.json(gallery);
  }

  async update(req, res) {
    const gallery = await AdminGallery.findByPk(req.params.id, {
      include: [
        {
          model: AdminUser,
          as: 'user',
          attributes: ['name'],
        },
        {
          model: AdminGalleryImage,
          as: 'images',
        },
      ],
    });

    if (!gallery) {
      return res.status(400).json({ error: 'Gallery not Found' });
    }

    await gallery.update(req.body);

    return res.json(gallery);
  }

  async delete(req, res) {
    const gallery = await AdminGallery.findByPk(req.params.id, {
      include: [
        {
          model: AdminGalleryImage,
          as: 'images',
        },
      ],
    });

    if (!gallery) {
      return res.status(400).json({ error: 'Gallery not Found' });
    }

    if (gallery.images && process.env.STORAGE_TYPE === 'local') {
      const path = resolve(
        __dirname,
        '..',
        '..',
        '..',
        'uploads',
        'admin-galleries',
        req.params.id
      );

      try {
        del(path);
      } catch (err) {
        return res.json(err);
      }
    }

    /**
     * ALL THE BULLSHIT YOU NEED TO DELETE FILES IN AMAZON S3
     */

    async function emptyS3Directory(dir) {
      const listParams = {
        Bucket: process.env.S3_IMAGES_BUCKET,
        Prefix: dir,
      };

      const listedObjects = await s3.listObjectsV2(listParams).promise();

      if (listedObjects.Contents.length === 0) return;

      const deleteParams = {
        Bucket: process.env.S3_IMAGES_BUCKET,
        Delete: { Objects: [] },
      };

      listedObjects.Contents.forEach(({ Key }) => {
        deleteParams.Delete.Objects.push({ Key });
      });

      await s3.deleteObjects(deleteParams).promise();

      if (listedObjects.IsTruncated) await emptyS3Directory(dir);
    }

    if (gallery.images && process.env.STORAGE_TYPE === 's3') {
      try {
        emptyS3Directory(`admin-galleries/${gallery.id}`);
      } catch (err) {
        if (err) {
          return res.status(500).json({ error: 'Failed to delete on S3' });
        }
      }
    }

    gallery.destroy();

    return res.json({ message: 'Gallery Successfully deleted' });
  }
}

export default new AdminGalleryController();
