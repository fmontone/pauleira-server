import Sequelize, { Model } from 'sequelize';

class Gallery extends Model {
  static init(sequelize) {
    super.init(
      {
        title: Sequelize.STRING,
        description: Sequelize.TEXT,
        likes: Sequelize.INTEGER,
        status: Sequelize.STRING,
      },
      { sequelize }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.hasMany(models.GalleryImage, {
      foreignKey: 'gallery_id',
      as: 'images',
    });
  }
}

export default Gallery;
