import { createRef, useRef, useState, useEffect } from 'react';
import '../css/RequirePasswordReset.css'
import ErrorMessage from './ErrorMessage';
function RequirePasswordReset(){

    const credField = useRef(null)

    const authServerDomain = useRef("http://212.224.88.70:31212")
    const resourceServerDomain = useRef("http://212.224.88.70:21212")

    const[isSent, setIsSent] = useState(false);
    const formRef = useRef(null);
    const[showLogo, setShowLogo] = useState(window.innerWidth >= 800)


    
    const [errorMessageData, setErrorMessageData] = useState({
        "message": "error",
        "show": false
    });

   
    useEffect(()=>{
        addInputOnClickListeners();
    },[])
    function clearTimeouts(){
        var id = window.setTimeout(function() {}, 0);
        while (id >= 0){
            window.clearTimeout(id--);
        }
    }

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

    function addInputOnClickListeners(){
        let inputs = formRef.current.querySelectorAll('input');
        inputs.forEach(input =>{
           input.addEventListener('click', () => {
             input.classList.remove('error');
           })
        })
    }

    function onConfirmButtonClick(){
        if (!checkAllFieldsFilled()) return;
        let cred = credField.current.value;
        fetch(resourceServerDomain.current + "/api/password-reset/require-reset", {
            method: "post",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify({'cred': cred})
        }).then((response) =>{
            if (!response.ok){
                showError("Wrong Email or Username")
                return;
            }
            setIsSent(true);
        }).catch((error) =>{
            showError("Unknown error. Reload page and try again")
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
        <div className='require-reset-page-container'>
            {isSent ?
            <div className='message-sent-container'>
                <p className='message-sent-message'>You will receive a message with instructions within 1 minute. If you won't receive the message, you can try <a href={window.location.pathname}>again</a></p>
            </div> 
            :
            <div >
                <div className='require-reset-title-container'>
                    <p className='require-reset-title'>Reset password</p>
                </div>
                <div ref={formRef} className='require-reset-details-container'>
                    <label for="email">Enter your Email or Username</label>
                    <input ref={credField} placeholder='email or username' name='email'></input>
                    <button onClick={() => onConfirmButtonClick()}>Send me instructions</button>
                </div>
                {showLogo && <div className='require-reset-logo-container'>
                    <img src={require("../pics/logos/koolitrek/KOOLITREK BLUE ONLY PIC NO BCK.png")}></img>
                </div>}
            </div>
            }
            {errorMessageData['show'] && <ErrorMessage data={errorMessageData}/>}
        </div>
    )
}
export default RequirePasswordReset;