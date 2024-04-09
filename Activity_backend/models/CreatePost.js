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
        latitude:{
          type:DataTypes.FLOAT,
          allowNull:true
        },
        longitude:{
          type:DataTypes.FLOAT,
          allowNull:true
        },
        endorsementCounter: { // New field for endorsement counter
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0, // Default value is 0
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
  