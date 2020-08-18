import Sequelize from 'sequelize';

import databaseConfig from '../config/database';

import AdminUser from '../app/models/AdminUser';
import AdminProfileImage from '../app/models/AdminProfileImage';

const models = [AdminUser, AdminProfileImage];

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
