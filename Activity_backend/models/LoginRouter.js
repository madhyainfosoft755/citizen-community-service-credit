// module.exports = (sequelize, DataTypes) => {
// const  users = sequelize.define(' users ', {
//   // id: {
//   //   type:DataTypes.STRING,
//   // },
//   // access_Token: {
//   //     type:DataTypes.STRING,
//   //   },
    
//     name: {
//     type:DataTypes.STRING,
//   },
//   email:{
//     type:DataTypes.STRING,
//   },
//   Credential:{
//     type:DataTypes.STRING,
//   }


   
//   },{timestamps:false});
//   return users;
// }

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('users', {
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
     
      photo:{
        type:DataTypes.STRING,
        allowNull:true
      },
      category:{
        type:DataTypes.STRING,
        allowNull:true
      },
      
      
      

    },
    {
      timestamps:false
    });
    return User
  }

  // module.exports = (sequelize, DataTypes) => {
  //   const posts = sequelize.define('posts', {
      
  //       Category: {
  //         type: DataTypes.STRING,
  //         allowNull: false,
  //         // unique: true,
  //       },
  //       photo: {
  //         type: DataTypes.STRING,
  //         allowNull: false,
  //         // unique: true,
  //       },
        
  
  //     },
  //     {
  //       timestamps:false
  //     });
  //     return posts
  //   }