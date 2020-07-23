const bcrypt = require('bcryptjs');

module.exports = {
  up: queryInterface => {
    return queryInterface.bulkInsert(
      'users',
      [
        {
          name: 'Fulano da Silva',
          email: 'fulano@mail.com',
          a_k_a: null,
          role: 'instructor',
          password_hash: bcrypt.hashSync('123456', 8),
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'José Ciclano Monteiro',
          email: 'ciclano@mail.com',
          a_k_a: null,
          role: 'instructor',
          password_hash: bcrypt.hashSync('123456', 8),
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: queryInterface => {
    return queryInterface.bulkDelete('users', null, {});
  },
};
