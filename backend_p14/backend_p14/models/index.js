const { Sequelize } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite',
});

const Skripsi = require('./Skripsi')(sequelize);
const User = require('./User')(sequelize);

sequelize.sync();

module.exports = { sequelize, Skripsi, User };
