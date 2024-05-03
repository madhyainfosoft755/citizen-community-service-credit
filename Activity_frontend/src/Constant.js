// export const API_URL = "https://ccsc.helpersin.com/api";
const host = window.location.hostname;
let API_URL;
if(host == 'localhost'){
     API_URL = "http://192.168.134.92:4116/api";

}
else{
    API_URL = "https://ccsc.helpersin.com/api";
}

export {API_URL};