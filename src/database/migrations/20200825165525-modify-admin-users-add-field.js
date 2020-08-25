module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('admin_users', 'reset_link', {
      type: Sequelize.STRING,
      defaultValue: '',
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('admin_users', 'reset_link');
  },
};
