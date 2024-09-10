module.exports = (sequelize, DataTypes) => {
  const AttachOrg = sequelize.define(
    "attach_organizations",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      OrgId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: true,
    }
  );
  return AttachOrg;
};
