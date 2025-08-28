import axios from "axios";

/*===========================================*/
/*===========================================*/
/*===========================================*/

const request = axios.create({
  // baseURL: process.env.REACT_APP_BASE_URL || "http://localhost:3001",
  baseURL: process.env.REACT_APP_BASE_URL,

  withCredentials: true

});

export default request; 