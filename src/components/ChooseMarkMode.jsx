import '../css/ChooseMarkMode.css'
function ChooseMarkMode(props){





    return (
        <div className={props.chosen ? "choose-mark-mode-container chosen" : "choose-mark-mode-container"} onClick={() => props.onClick(props.ind)}>
            <div className='choose-mark-mode-title-container'>
                <p className='choose-mark-mode-title'>{props.name}</p>
            </div>
            <div className='choose-mark-mode-example-container'>
                <p className='choose-mark-mode-example'>{props.example}</p>
            </div>
        </div>
    )
}
export default ChooseMarkMode;