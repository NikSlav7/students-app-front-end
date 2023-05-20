import { useLocation, useParams } from "react-router";
import { useState, useEffect, useRef} from "react";
import '../css/PasswordReset.css'
import ErrorMessage from "./ErrorMessage";

function PasswordReset(){

    const token = new URLSearchParams(useLocation().search).get("reset-password-token");

    const[isTokenValid, setIsTokenValid] = useState(null);

    const passwordField = useRef(null);
    const passwordRepField = useRef(null);

    const authServerDomain = useRef("http://212.224.88.70:31212")
    const resourceServerDomain = useRef("http://212.224.88.70:21212")

    const formRef = useRef(null);

    const[showLogo, setShowLogo] = useState(window.innerWidth >= 800)

    const [errorMessageData, setErrorMessageData] = useState({
        "message": "error",
        "show": false
    });

    window.addEventListener('resize', () =>{
        if (window.innerWidth < 800 && showLogo) setShowLogo(false)
        if (window.innerWidth >= 800 && !showLogo) setShowLogo(true)
    })

   
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

    function validateToken(){
        let url = new URL(resourceServerDomain.current + "/api/password-reset/check-token");
        let params = {"token": token}
        Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]));
        fetch(url,{
            method: 'get'
        }).then((response) =>{
            if (response.ok)
            response.json().then((result) =>{
                setIsTokenValid(true)
            });
            else {
                setIsTokenValid(valse)
            }
        }).catch((error) =>{
            setIsTokenValid(false)
        })
    }

    function validatePasswords(){
        console.log(passwordField.current.value + ' ' + passwordRepField.current.value)
        if (passwordField.current.value === ''){
            showError("Please, enter the password")
            return false;
        } 
        if (passwordField.current.value !== passwordRepField.current.value) {
            console.log();
            showError("Passwords don't match")
            return false;
        }
        return true;
    }
    function onConfirmButtonClick(){
        if (!checkAllFieldsFilled() || !validatePasswords()) return;
        resetPassword();
        console.log(passwordField.current.value)
    }

    

    useEffect(()=>{
        validateToken();
    },[])
    useEffect(()=>{
        if (isTokenValid) addInputOnClickListeners();
    }, [isTokenValid])

    function clearTimeouts(){
        var id = window.setTimeout(function() {}, 0);
        while (id >= 0){
            window.clearTimeout(id--);
        }
    }

    function addInputOnClickListeners(){
        let inputs = formRef.current.querySelectorAll('input');
        inputs.forEach(input =>{
           input.addEventListener('click', () => {
             input.classList.remove('error');
           })
        })
    }

    function resetPassword(){
        fetch(resourceServerDomain.current + "/api/password-reset/reset", {
            method: 'post',
            headers:{
                Authorization: "Bearer "+ getCookie("STUDENTS_ACCESS_TOKEN"),
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({'password': passwordField.current.value, "passwordRepeat": passwordRepField.current.value, "token": token})
        }).then((response) =>{
            console.log(response)
            if (response.ok) window.location.pathname = '/login';
            else showError("Somer error occured, please try again")
        }).catch((error) =>{
            showError("Somer error occured, please try again")
        })

    }
    function getCookie(name){
        let cookie = '; ' + document.cookie;
        let parts = cookie.split("; " + name  + '=')
        if (parts.length === 2) return parts.pop().split(";").shift();
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

    return (
        <div className="password-reset-page-container">
            {isTokenValid ?
                <div>
                     <div className='password-reset-title-container'>
                        <p className='password-reset-title'>Reset password</p>
                    </div>
                    <div ref={formRef} className='password-reset-details-container'>
                        <label for="password">Enter new password</label>
                        <input type="password" ref={passwordField} placeholder='password' name='password'></input>
                        <label  for="password-repeat">Repeat password</label>
                        <input type="password" ref={passwordRepField} placeholder='password repeat' name='password-repeat'></input>
                        <button onClick={()=> onConfirmButtonClick()}>Reset Password</button>
                    </div>
                    {showLogo && <div className='password-reset-logo-container'>
                        <img src={require("../pics/logos/koolitrek/KOOLITREK BLUE ONLY PIC NO BCK.png")}></img>
                    </div>}
                </div> 
                : 
                <div className="password-reset-invalid-token-container">
                    {isTokenValid !== null && <div>
                    <p className="password-reset-invalid-token-message">Your reset password token is invalid or has been expired. <br></br> Request the password change <a className="password-reset-invalid-token-link" href="/password/require-reset">again</a></p>
                    <img className="password-reset-invalid-token-logo" src={require("../pics/logos/koolitrek/KOOLITREK BLACK ONLY PIC NO BCKG.png")}></img>
                    </div>}
                </div>
            }
            {errorMessageData['show'] && <ErrorMessage data={errorMessageData}/>}
        </div>
    )
}
export default PasswordReset;