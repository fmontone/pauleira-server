import Sequelize, { Model } from 'sequelize';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import aws from 'aws-sdk';

const s3 = new aws.S3();

class AdminProfileImage extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        url: Sequelize.STRING,
      },
      {
        hooks: {
          beforeDestroy: image => {
            if (process.env.STORAGE_TYPE === 's3') {
              return s3
                .deleteObject({
                  Bucket: 'pauleiraimages/admin-profile-images',
                  Key: image.name,
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
                'admin-profile-images',
                image.name
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
    this.belongsTo(models.AdminUser, {
      foreignKey: 'user_id',
      as: 'user',
    });
  }
}

export default AdminProfileImage;
