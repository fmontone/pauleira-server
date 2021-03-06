import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import authConfig from '../../config/auth';

class AdminUser extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        reset_link: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    this.addHook('beforeSave', async user => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }

  generateToken() {
    return {
      token: jwt.sign({}, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    };
  }

  static associate(models) {
    this.hasOne(models.AdminProfileImage, {
      foreignKey: 'user_id',
      as: 'profile_image',
    });
  }
}

export default AdminUser;
