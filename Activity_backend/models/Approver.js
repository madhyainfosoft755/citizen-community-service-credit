const organization = require("./organization");

module.exports = (sequelize, DataTypes) => {
  const Approver = sequelize.define(
    "approver",
    {
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
      organization: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isEnabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: true, // Default value is true (enabled)
      },
    },
    {
      timestamps: true,
    }
  );
  return Approver;
};
