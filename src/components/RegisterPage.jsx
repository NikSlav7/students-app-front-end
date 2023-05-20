import "../css/RegisterPage.css"
import { useEffect, useRef, useState } from "react";
import {BackendApiSender} from "../BackendApiSender.js"
import ErrorMessage from "./ErrorMessage";
function RegisterPage(){

    const authServerDomain = useRef("http://212.224.88.70:31212")
    const resourceServerDomain = useRef("http://212.224.88.70:21212")
    const[showLogo, setShowLogo] = useState(window.innerWidth >= 800)
    const formRef = useRef(null);

    const [errorMessageData, setErrorMessageData] = useState({
        "message": "error",
        "show": false
    });
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
    

    function onRegisterButtonClick(){
        if (!checkAllFieldsFilled()) return;
        let form = document.getElementById("register-details-form");
        let regBody = {};
        let repPas;
        Object.keys(form.elements).forEach(key => {
           if (key !== 'password-repeat' && !isInt(key)) {
            regBody[key] = form.elements[key].value;
           }
           else {
             repPas = form.elements[key].value;
           }
        });
        if (repPas.trim() !== regBody['password'].trim()) {
            showError("The passwords don't match")
            return;
        }
        let sender = new BackendApiSender();
        sender.register(resourceServerDomain.current + "/api/auth/register", regBody);
        /*
        let sender = new BackendApiSender(1000, 1000);
        sender.sendRequest(username, password, authServerDomain.current+"/api/auth/login")
        */
    }
    function addInputOnClickListeners(){
        let inputs = formRef.current.querySelectorAll('input');
        inputs.forEach(input =>{
           input.addEventListener('click', () => {
             input.classList.remove('error');
           })
        })
    }

    useEffect(()=>{
        addInputOnClickListeners();
    },[])

    window.addEventListener('resize', () =>{
        if (window.innerWidth < 800 && showLogo) setShowLogo(false)
        if (window.innerWidth >= 800 && !showLogo) setShowLogo(true)
    })

    function isInt(value) {
        return value == parseInt(value, 10)
      }

    function onLoginButtonClick(){
        window.location.pathname = "/login";
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


    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
      }

    return(
        <div className="register-page-container" >
            {showLogo &&
             <div className="logo-container">
                <div className="register-page-logo-container">
                    <img className="register-page-logo" src={require("../pics/logos/koolitrek/KOOLITREK FULL LOGO PNG.png")}></img>
                </div>
            </div>}
            <div className="details-container">
                <div className="register-details-container">
                    <div className="register-title-container">
                        <p className="register-title">Please Register</p>
                    </div>
                    <div className="register-details">
                        <div className="creds-container">
                                <form ref={formRef} id="register-details-form" className="register-details-details" method="post" onSubmit={(e) => e.preventDefault()}>
                                    <input name="email" placeholder="Email"></input>
                                    <input name="username" placeholder="Username"></input>
                                    <input name="password" placeholder="Password" type="password"></input>
                                    <input name="password-repeat" placeholder="Repeat Password" type="password"></input>
                                    <input name="firstName" placeholder="First Name"></input>
                                    <input name="secondName" placeholder="Second Name"></input>
                                </form> 
                        </div>
                        <div className="register-btn-container">
                            <button className="register-button" onClick={() => onRegisterButtonClick()}>Register</button>
                        </div>
                        <div className="register-container">
                            <div className="register-container-text-container">
                                <p className="register-container-text">Already have an account?</p>
                            </div>
                            <div className="register-container-button-container">
                                <p className="register-container-button" onClick={() => onLoginButtonClick()}>Login</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {errorMessageData['show'] && <ErrorMessage data={errorMessageData}/>}
        </div>
    )
    
}
export default RegisterPage;

