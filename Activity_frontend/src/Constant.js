 // export const API_URL = "https://ccsc.helpersin.com/api";
const host = window.location.hostname;
let API_URL;
if(host == 'localhost'){
     API_URL = "http://localhost:4116/api";

}
else{
    API_URL = "https://cch247.com/api";
}

export {API_URL};