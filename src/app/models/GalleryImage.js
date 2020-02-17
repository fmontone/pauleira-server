import Sequelize, { Model } from 'sequelize';

class GalleryImage extends Model {
  static init(sequelize) {
    super.init(
      {
        title: Sequelize.STRING,
        description: Sequelize.STRING,
        url: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Gallery, { foreignKey: 'gallery_id', as: 'images' });
  }
}

export default GalleryImage;
