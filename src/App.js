import logo from './logo.svg';
import './App.css';
import { Routes, Route, Redirect } from 'react-router';
import { Navigate } from 'react-router';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import MainPage from './components/MainPage';
import RequirePasswordReset from './components/RequirePasswordReset';
import PasswordReset from './components/PasswordReset';

function App() {
  return (
    <div className="App">
      <Routes> 
        <Route path='/login' element={<LoginPage />}/>
        <Route path='/register' element={<RegisterPage />}/>
        <Route path='/' element={<MainPage />}/>
        <Route path="*" element={<Navigate to='/'  />}/>
        <Route path='/password/require-reset' element={<RequirePasswordReset />}></Route>
        <Route path='/password/reset' element={<PasswordReset />}></Route>
      </Routes>
    </div>
  );
}

export default App;
