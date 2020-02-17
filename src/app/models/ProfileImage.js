import Sequelize, { Model } from 'sequelize';

class ProfileImage extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        url: Sequelize.STRING,
      },
      {
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
