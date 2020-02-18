import Sequelize, { Model } from 'sequelize';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import aws from 'aws-sdk';

const s3 = new aws.S3();

class ProfileImage extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        url: Sequelize.STRING,
      },
      {
        hooks: {
          beforeDestroy: (image, options) => { // eslint-disable-line
            if (process.env.STORAGE_TYPE === 's3') {
              return s3
                .deleteObject({
                  Bucket: 'pauleiraimages/profile',
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
                'profile',
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
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  }
}

export default ProfileImage;
