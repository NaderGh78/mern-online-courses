import axios from "axios";

/*===========================================*/
/*===========================================*/
/*===========================================*/

// const localy = "http://localhost:3001";

// const production = "https://online-courses-mern-stack.onrender.com";

const request = axios.create({
  // baseURL: process.env.REACT_APP_BASE_URL || "http://localhost:3001",
  baseURL: process.env.REACT_APP_BASE_URL,
  withCredentials: true
});

export default request; 