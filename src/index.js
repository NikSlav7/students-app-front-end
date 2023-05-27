import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, HashRouter, Router } from 'react-router-dom';
import { BackendApiSender } from './BackendApiSender';
import { useRef } from 'react';


const root = ReactDOM.createRoot(document.getElementById('root'));
const authServerDomain = process.env.REACT_APP_ENV==='dev' ?  ("http://" + process.env.REACT_APP_DEV_DOMAIN + ":31212") : ("http://" + process.env.REACT_APP_PROD_DOMAIN + ":31212")
root.render(
  <HashRouter >
      <App />
  </HashRouter>
)
const loginFreePages = ["#/login", "#/register", '#/password/require-reset', '#/password/reset']
const events = ['load', 'hashchange']
events.forEach(element => {
  window.addEventListener(element, async function(){
    console.log('hej' + window.location.pathname)
    console.log(process.env.REACT_APP_ENV)
    let apiSender = new BackendApiSender(authServerDomain, "");
    if (!loginFreePages.some(domain => domain === window.location.hash))
      apiSender.checkToken(authServerDomain + "/api/auth/checktoken", getCookie("STUDENTS_ACCESS_TOKEN")).then(() =>{
      });
  })
});
/*
window.onload = async function(){
  console.log('hej' + window.location.pathname)
  console.log(process.env.REACT_APP_ENV)
  let apiSender = new BackendApiSender(authServerDomain, "");
  if (!loginFreePages.some(domain => domain === window.location.pathname))
    apiSender.checkToken(authServerDomain + "/api/auth/checktoken", getCookie("STUDENTS_ACCESS_TOKEN")).then(() =>{
    });
}
*/
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
