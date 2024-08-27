const Sequelize = require('sequelize');
const db = new Sequelize(process.env.DB_SCEM, process.env.DB_USER, process.env.DB_PASS, {
	dialect: process.env.DB_DIALECT,
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	logging: false,
	timezone: "+07:00"
});

db.authenticate()
.then(() => {
	console.log('Connection database has been established successfully.');
})
.catch(err => {
	console.error('Unable to connect to the database:', err);
});

module.exports = db;
