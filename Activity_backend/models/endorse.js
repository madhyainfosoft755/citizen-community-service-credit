// Create a new model for endorsements


module.exports = (sequelize, DataTypes) => {
    const Endorsement = sequelize.define(
      "endorsement",
      {
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        postId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        timestamps: false, // Disable timestamps for this model if not needed
      }
    );
  
    return Endorsement;
  };
  