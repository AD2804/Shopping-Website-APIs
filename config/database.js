const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('myschema', 'root', 'Aaditya@2004', {
  host: 'localhost',
  dialect: 'mysql',
  // define: {
  //   schema: 'myschema' // Specify the schema name here
  // },
  logging: console.log, // Enable query logging
});

sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;
