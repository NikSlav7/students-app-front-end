import { useEffect, useState, useRef } from 'react';
import '../css/LoadData.css'
import Upload from './Upload';
function LoadData(props){


    const containerRef = useRef(null);

    function onScroll(){
        console.log((containerRef.current.scrollTop + containerRef.current.offsetHeight) + ' ' + containerRef.current.scrollHeight)
        if (containerRef.current.scrollTop + containerRef.current.offsetHeight >= containerRef.current.scrollHeight-1) props.getUploads();
    }

    return(
    <div ref={containerRef} onScroll={() => onScroll()} className="loads-data-container">
        {props.uploadedList.map((element, ind) => <Upload ind={ind} deleteUpload={props.deleteUpload}  data={element}/>)}
    </div>)
}
export default LoadData;
