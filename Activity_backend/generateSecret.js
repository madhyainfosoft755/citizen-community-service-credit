
//for generating session-secret-key
// const fs = require('fs');
// const crypto = require('crypto');

// // Generate a random session secret key
// const sessionSecret = crypto.randomBytes(32).toString('hex');

// // Write the generated key to a .env file
// fs.writeFileSync('.env', `SESSION_SECRET=${sessionSecret}\n`);

// console.log('Session secret key generated and saved to .env file.');


//for generating jwt-secret-key
// const crypto = require('crypto');

// const generateJWTSecret = () => {
//   return crypto.randomBytes(32).toString('hex');
// };

// const jwtSecret = generateJWTSecret();
// console.log('JWT Secret:', jwtSecret);



//generates random password
// const generateRandomPassword = (length) => {
//   const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-';
//   let password = '';

//   for (let i = 0; i < length; i++) {
//     const randomIndex = Math.floor(Math.random() * charset.length);
//     password += charset[randomIndex];
//   }

//   return password;
// };

// Example usage:
const passwordLength = 10;
const generatedPassword = generateRandomPassword(passwordLength);
console.log('Generated Password:', generatedPassword);
