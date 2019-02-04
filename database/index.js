const Sequelize = require('sequelize');

const sequelize = new Sequelize({
  database: 'twf',
  username: 'postgres',
  password: 'docker',
  host: '54.183.26.67',
  logging: false,
  dialect: 'postgres',
  pool: {
    max: 8,
    min: 0,
    idle: 10000
  },
  operatorsAliases: false
});

sequelize.authenticate().then(() => {
  console.log("Successfully connected to database bruh");
}).catch((err) => {
  console.log(err);
});

module.exports = { sequelize };
