import logo from './logo.svg';
import './App.css';
import { Routes, Route, Redirect} from 'react-router';
import { Navigate } from 'react-router';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import MainPage from './components/MainPage';
import RequirePasswordReset from './components/RequirePasswordReset';
import PasswordReset from './components/PasswordReset';

function App() {


  const paths = ['/login', '/register', '/', '/password/require-reset', '/password/reset']

  window.addEventListener("hashchange", () =>{
    let path = window.location.hash;
    if (path === undefined) window.location.replace("/#/");
    if (path.charAt(0) === '#') path=path.substring(1);
    console.log(path)
    if (!paths.some((el) => path === el)) window.location.replace("/#/");
  })
  window.addEventListener("load", () =>{
    let path = window.location.hash;
    if (path.charAt(0) === '#') path=path.substring(1);
    console.log(path)
    if (path === undefined || !paths.some((el) => path === el)) window.location.replace("/#/");
  })
  return (
    <div className="App">
      <Routes > 
        <Route path='/login' element={<LoginPage />}/>
        <Route path='/register' element={<RegisterPage />}/>
        <Route path='/' exact element={<MainPage />}/>
        <Route  element={<Navigate to='/#/'  />}/>
        <Route path='/password/require-reset' element={<RequirePasswordReset />}></Route>
        <Route path='/password/reset' element={<PasswordReset />}></Route>
      </Routes>
    </div>
  );
}

export default App;
