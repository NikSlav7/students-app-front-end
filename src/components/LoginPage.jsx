import "../css/LoginPage.css"
import { useRef, useEffect, useState } from "react";
import {BackendApiSender} from "../BackendApiSender.js"
import ErrorMessage from "./ErrorMessage";
function LoginPage(){

    const authServerDomain = useRef("http://212.224.88.70:31212")

    const formRef = useRef(null);

    const[flag, setFlag] = useState(false)

    const[showLogo, setShowLogo] = useState(window.innerWidth > 800)

    const [errorMessageData, setErrorMessageData] = useState({
        "message": "error",
        "show": false
    });
    

    useEffect(()=>{
        addInputOnClickListeners();
    },[])

    function addInputOnClickListeners(){
        let inputs = formRef.current.querySelectorAll('input');
        inputs.forEach(input =>{
           input.addEventListener('click', () => {
             input.classList.remove('error');
           })
        })
    }

    function onLoginButtonClick(){
        if (!checkAllFieldsFilled()) return;
        let form = document.getElementById("login-details-form");
        let username;
        let password;
        Object.keys(form.elements).forEach(key => {
            let element = form.elements[key];
            if (element.type !== "submit") {
                if (element.name === "username") username = element.value;
                if (element.name === "password") password = element.value;
            }
        });
        let sender = new BackendApiSender();
        sender.sendRequest(username, password, authServerDomain.current+"/api/auth/login").then().catch((error) =>{
            console.log("error");
            showError("Wrong Credentials")
        })

    }
    function onRegisterButtonClick(){
        window.location.pathname = "/register";
    }
    function checkAllFieldsFilled(){
        let emptyOccured = false;
        let inputs = formRef.current.querySelectorAll('input');
        inputs.forEach(input =>{
            if (input.value.trim() === ''){
                input.classList.add('error');
                emptyOccured = true;
            }
        })
        return !emptyOccured;
    }

    function clearTimeouts(){
        var id = window.setTimeout(function() {}, 0);
        while (id >= 0){
            window.clearTimeout(id--);
        }
    }

    function showError(message){
        clearTimeouts();
        let copy = structuredClone(errorMessageData);
        copy['show'] = true;
        copy['message'] = message;
        setErrorMessageData(errorMessageData => copy);

        setTimeout(() =>{
            hideError()
        }, 3000)
    }

    function hideError(){
        let copy = structuredClone(errorMessageData);
        copy['show'] = false;
        setErrorMessageData(errorMessageData => copy);
    }

    

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
      }
      window.addEventListener('resize', () =>{
        if (window.innerWidth < 800 && showLogo) setShowLogo(false)
        if (window.innerWidth >= 800 && !showLogo) setShowLogo(true)
    })

    return(
        <div className="login-page-container" >
            {showLogo && <div className="logo-container">
                <div className="login-page-logo-container">
                    <img className="login-page-logo" src={require("../pics/logos/koolitrek/KOOLITREK FULL LOGO PNG.png")}></img>
                </div>
            </div>}

            <div className="details-container">
                <div className="login-details-container">
                    <div className="login-title-container">
                        <p className="login-title">Please Log-In</p>
                    </div>
                    <div className="login-details">
                        <div className="creds-container">
                            <form ref={formRef} id="login-details-form" className="login-details-details" method="post" onSubmit={(e) => e.preventDefault()}>
                                <label for="username">Username</label>
                                <input name="username" placeholder="Username" id="username-input"></input>
                                <label for="password">Password</label>
                                <input name="password" placeholder="Password" type="password" id='password-input'></input>
                                <a className="forget-password-link" href="/password/require-reset">Forgot Password</a>
                            </form>
                        </div>
                        <div className="login-btn-container">
                            <button className="login-button" onClick={() => onLoginButtonClick()}>Login</button>
                        </div>
                        <div className="register-container">
                            <div className="register-container-text-container">
                                <p className="register-container-text">Don't have an account?</p>
                            </div>
                            <div className="register-container-button-container">
                                <p className="register-container-button" onClick={() => onRegisterButtonClick()}>Register</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {errorMessageData['show'] && <ErrorMessage data={errorMessageData}/>}
        </div>
    )
}


                                
export default LoginPage;