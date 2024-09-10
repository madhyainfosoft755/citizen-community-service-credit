// Create a new model for endorsements


module.exports = (sequelize, DataTypes) => {
    const LoginLog = sequelize.define(
      "loginlog",
      {
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        }
      },
      {
        timestamps: true, // Disable timestamps for this model if not needed
      }
    );
  
    return LoginLog;
  };
  