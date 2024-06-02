// import axios from "axios"

// const API_KEY = '43922989-c4746e6a245b8a4b7c5e9f6bd';

// const apiUrl = `https://pixabay.com/api/?key=${API_KEY}`;

// const formatUrl = (params)=>{
//     let url = apiUrl+ "&per_page=25&safesearch=ture&editors_choice=true"
//     if(!params)return url;
//     let paramKeys = Object.keys(params);
//     paramKeys.map(key=>{
//         let value = key =='q'? encodeURIComponent(params[key]): params[key];
//         url +=`&${key}=${value}`;
//     });
//     console.log('final url:',url);
//     return url;
// }


// export const apiCall = async (params)=>{
//     try {
//          const response = await axios.get(formatUrl(params));
//          const {data }= response;
//          return {success: true,data}
//     }catch(err){
//         console.log('got err:',err.message);
//         return {success: false, msg:err.message};
//     }
// }

import axios from "axios";

const API_KEY = '43922989-c4746e6a245b8a4b7c5e9f6bd';

const apiUrl = `https://pixabay.com/api/?key=${API_KEY}`;

const formatUrl = (params)=>{
    let url = apiUrl+ "&per_page=25&safesearch=ture&editors_choice=true"
    if(!params)return url;
    let paramKeys = Object.keys(params);
    paramKeys.map(key=>{
        let value = key =='q'? encodeURIComponent(params[key]): params[key];
        url +=`&${key}=${value}`;
    });
    console.log('final url:',url);
    return url;
}

export const apiCall = async (params)=>{
    try {
         const response = await axios.get(formatUrl(params));
         const {data }= response;
         return {success: true,data}
    }catch(err){
        console.log('got err:',err.message);
        return {success: false, msg:err.message};
    }
}
