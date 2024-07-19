// Create a new model for endorsements
module.exports = (sequelize, DataTypes) => {
    const VisitorLogs = sequelize.define(
      "visitorlogs",
      {
        page: {
          type: DataTypes.STRING,
          allowNull: true,
          },
        count: {
          type: DataTypes.INTEGER,
          allowNull: true,
        }
      },
      {
        timestamps: true, // Disable timestamps for this model if not needed
      }
    );
  
    return VisitorLogs;
  };
  