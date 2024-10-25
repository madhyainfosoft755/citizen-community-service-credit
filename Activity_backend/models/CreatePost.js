const organization = require("./organization");

module.exports = (sequelize, DataTypes) => {
  const posts = sequelize.define(
    "posts",
    {
      Date: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      photos: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      videos: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      fromTime: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      totalTime: {
        type: DataTypes.TIME,
        allowNull: false,
      },

      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      latitude: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      longitude: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      endorsementCounter: {
        // New field for endorsement counter
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0, // Default value is 0
      },
      approved: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      rejected: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      rejectionReason: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      endorser_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      organization: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },

    {
      timestamps: true,
    }
  );

  return posts;
};
