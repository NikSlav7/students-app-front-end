import '../css/LoadData.css'
import { useDebugValue, useEffect, useRef } from 'react';

function Upload(props){


    const buttonRef = useRef(null)

    useEffect(()=>{
        onHoverEnd()
    },[])

    function onRemoveButtonClick(){
        props.deleteUpload(props.ind)
    }

    function onHover(){
        buttonRef.current.style.opacity = '100%';
    }

    function onHoverEnd(){
        buttonRef.current.style.opacity = '0';
    }

    return (
        <div onMouseOver={() => onHover()} onMouseOut={() => onHoverEnd()} className='load-data'>
            <div className='load-data-overall-info'>
                <p >Overall average</p>
                <p className='load-data-overall-average'>{props.data['overallAvg'].toFixed(2)}</p>
            </div>
            <div className='load-data-date'>
                <p>{props.data['uploadDate']}</p>
            </div>
            <div ref={buttonRef}  className='load-data-delete'>
                <button className='load-data-delete-button' onClick={() =>  onRemoveButtonClick()}>x</button>
            </div>
        </div>
    )
}
export default Upload;