module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "users",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      photo: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      googleId: {
        type: DataTypes.STRING,
        unique: true,
      },
      verificationToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false, // Default value for verified field
      },
      resetPin: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      organization: {
        type: DataTypes.STRING, // Adjust the type based on your requirements
        allowNull: true, // Set to false if it's mandatory
      },
      aadhar: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      linklogin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false, // Default value for verified field
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      orgId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      timestamps: true,
    }
  );
  return User;
};
