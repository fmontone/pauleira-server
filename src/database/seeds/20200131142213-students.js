const bcrypt = require('bcryptjs');

module.exports = {
  up: queryInterface => {
    return queryInterface.bulkInsert(
      'users',
      [
        {
          name: 'Erwin Shmidt',
          email: 'erwin@mail.com',
          a_k_a: 'E.S.W. Luthieria',
          role: 'STD',
          password_hash: bcrypt.hashSync('123456', 8),
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'André Souza',
          email: 'andre@mail.com',
          a_k_a: '6 Fingers Luthieria',
          role: 'STD',
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
