import Sequelize, { Model } from 'sequelize';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import aws from 'aws-sdk';

const s3 = new aws.S3();

class AdminGalleryImage extends Model {
  static init(sequelize) {
    super.init(
      {
        title: Sequelize.STRING,
        description: Sequelize.STRING,
        url: Sequelize.STRING,
        position: Sequelize.INTEGER,
        key: Sequelize.VIRTUAL(),
      },
      {
        hooks: {
          beforeDestroy: (image, options) => { // eslint-disable-line
            const imageUrl = image.url.split('/');
            const imageName = imageUrl[imageUrl.length - 1];

            if (process.env.STORAGE_TYPE === 's3') {
              return s3
                .deleteObject({
                  Bucket: `pauleiraimages/admin-galleries/${image.gallery_id}`,
                  Key: imageName,
                })
                .promise();
            }
            return promisify(fs.unlink)(
              path.resolve(
                __dirname,
                '..',
                '..',
                '..',
                'uploads',
                'admin-galleries',
                String(image.gallery_id),
                imageName
              )
            );
          },
        },
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.AdminGallery, {
      foreignKey: 'gallery_id',
      as: 'images',
    });
  }
}

export default AdminGalleryImage;
