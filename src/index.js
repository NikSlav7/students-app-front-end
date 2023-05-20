import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { BackendApiSender } from './BackendApiSender';
import { useRef } from 'react';

const root = ReactDOM.createRoot(document.getElementById('root'));
const authServerDomain = "http://212.224.88.70:31212";
root.render(
  <BrowserRouter >
      <App />
  </BrowserRouter>
)
const loginFreePages = ["/login", "/register", '/password/require-reset', '/password/reset']

window.onload = async function(){
  let apiSender = new BackendApiSender(authServerDomain, "");
  if (!loginFreePages.some(domain => domain === window.location.pathname))
    apiSender.checkToken(authServerDomain + "/api/auth/checktoken", getCookie("STUDENTS_ACCESS_TOKEN")).then(() =>{
    });
    
}
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  else return null;
}
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
