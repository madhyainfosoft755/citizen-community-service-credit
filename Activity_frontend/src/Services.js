import { API_URL } from 'Constant'



export const LoginApi = async (formData) =>{
    try{

        const response = await fetch(
            `${API_URL}/Activity/GoogleResponse`, 
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(formData),
            }
          );
     
          if (!response.ok) {
               console.log("Invalid Credentials");
               return;
          }
    
          const data = await response.json();
          return data;


    }catch(err){
        console.log(err);
    }
} 


export const getUserInfoFromGoogle = async (tokenResponse) =>{
  try{

      const response = await fetch(
          `https://www.googleapis.com/oauth2/v3/userinfo`, 
          {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          }
        );
   
        if (!response.ok) {
             console.log("Invalid Credentials");
             return;
        }
  
        const data = await response.json();
        return data;


  }catch(err){
      console.log(err);
  }
} 