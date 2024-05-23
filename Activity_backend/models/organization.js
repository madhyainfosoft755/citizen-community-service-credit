// models/organization.js
module.exports = (sequelize, DataTypes) => {
    const Organization = sequelize.define("organization", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isEnabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      
    },{
        timestamps: true, // This enables the createdAt and updatedAt fields
    });
  
    return Organization;
  };
  