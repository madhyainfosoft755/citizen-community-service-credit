module.exports = (sequelize, DataTypes) => {
    const posts  = sequelize.define(
      "posts",
      {
        
       
        Date: {
          type: DataTypes.STRING,
          allowNull: true,
        },
       
        photo:{
          type:DataTypes.STRING,
          allowNull:true
        },
        video:{
          type:DataTypes.STRING,
          allowNull:true
        },
        Category:{
          type:DataTypes.STRING,
          allowNull:true
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
  