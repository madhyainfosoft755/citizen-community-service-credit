const { Sequelize, DataTypes } = require("sequelize");
const database = require("../config/database");
const config = require("../config/constant");
const { upload } = require("../utils/util");

const sequelize = new Sequelize(config.DB, config.USER_DB, config.PASSWORD_DB, {
	host: "localhost",
	dialect: "mysql",
	pool: { min: 0, max: 10, idle: 10000 },
});

sequelize
	.authenticate()
	.then(() => {
		console.log("connected");
	})
	.catch((err) => {
		console.log("err " + err);
	});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;



db.users = require("./LoginRouter")(sequelize, DataTypes);
// db.Posts = require('./CreatePost')(sequelize,DataTypes);
db.Posts = require('./CreatePost')(sequelize, DataTypes);

// Define the relationship between User and Post
db.users.hasMany(db.Posts, { foreignKey: 'UserId' }); // Assuming 'UserId' is the foreign key in the Post model
db.Posts.belongsTo(db.users, { foreignKey: 'UserId' }); // Assuming 'UserId' is the foreign key in the Post model

db.sequelize.sync().then(() => {
	console.log("yes sync");
});

module.exports = db;
