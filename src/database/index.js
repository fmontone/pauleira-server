import Sequelize from 'sequelize';

import databaseConfig from '../config/database';

import AdminUser from '../app/models/AdminUser';
import AdminProfileImage from '../app/models/AdminProfileImage';
import AdminGallery from '../app/models/AdminGallery';
import AdminGalleryImage from '../app/models/AdminGalleryImage';

const models = [AdminUser, AdminProfileImage, AdminGallery, AdminGalleryImage];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
