module.exports = (sequelize, DataTypes) => {
    const posts  = sequelize.define(
      "posts",
      {
        
       
        Date: {
          type: DataTypes.STRING,
          allowNull: true,
        },
       
        photos:{
          type:DataTypes.STRING,
          allowNull:true
        },
        videos:{
          type:DataTypes.STRING,
          allowNull:true
        },
        category:{
          type:DataTypes.STRING,
          allowNull:true
        },
        totalTime:{
          type:DataTypes.TIME,
          allowNull:true
        },
        
        UserId:{
          type:DataTypes.INTEGER,
          allowNull:true
        },
        location: {
          type: DataTypes.STRING, // Assuming location is a string, modify data type accordingly
          allowNull: true,
        },
        latitude: {
          type: DataTypes.FLOAT,
          allowNull: true,
        },
        longitude: {
          type: DataTypes.FLOAT,
          allowNull: true,
        },
        
  
      },
      // {
      //   createdAt: "created_at",
      //   updatedAt: "updated_at",
      // }
      {
        timestamps:false
      });
    
  
    return posts;
  };
  