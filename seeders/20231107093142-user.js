'use strict';
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const email = 'admin@gmail.com';
    const password = await bcrypt.hash('Admin@1234', 10);
    const role = 'admin';
    let payload = {
      email: email,
      password: password,
      role: role,
    };
    await queryInterface.bulkInsert('users', [payload], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  },
};
