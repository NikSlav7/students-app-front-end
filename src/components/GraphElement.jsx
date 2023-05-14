import { useEffect, useRef, useState} from 'react';
import '../css/GraphElement.css'

function GraphElement(props){


    const textRef = useRef(null);


    const [isShowing, setIsShowing] = useState(props.isShowing);


    function onClick(){
        props.changeLine(props.ind, isShowing);
    }
    useEffect(()=>{
        console.log(props.title + " " + props.color)
        textRef.current.style.setProperty("--circle-color", textRef.current.getAttribute("circle-color"))
    }, [])
    return(
        <div onClick={() =>onClick()} className={isShowing  ? "graph-element-container" : " graph-element-container graph-element-container-hidden"}>
            <p ref={textRef} circle-color={props.color}>{props.title}</p>
        </div>
    )
}
export default GraphElement;