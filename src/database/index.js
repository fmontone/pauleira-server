import Sequelize from 'sequelize';

import databaseConfig from '../config/database';

import User from '../app/models/User';
import Gallery from '../app/models/Gallery';
import ProfileImage from '../app/models/ProfileImage';
import GalleryImage from '../app/models/GalleryImage';

const models = [User, Gallery, ProfileImage, GalleryImage];

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
