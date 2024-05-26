module.exports = (sequelize, DataTypes) => {
    const Approver = sequelize.define('approver', {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      aadhar: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
        timestamps: true,
   }
);
    return Approver;
  };
  