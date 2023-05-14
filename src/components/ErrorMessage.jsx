import '../css/ErrorMessage.css'
function ErrorMessage(props){
    return (
        <div className="error-message-container">
            <p>{props.data['message']}</p>
        </div>
    )
}
export default ErrorMessage;