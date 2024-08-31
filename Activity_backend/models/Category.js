module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define(
    "Category",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isEnabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: true, // Default value is true (enabled)
      },
    },
    {
      timestamps: true, // This enables the createdAt and updatedAt fields
    }
  );

  return Category;
};
