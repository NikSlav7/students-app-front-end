import { useRef } from 'react';
import '../css/LessonChoose.css'
function LessonChooseElement(props){

    const inputRef = useRef(null);

    function handleClick(){
        props.add(props.name);
    }
    function handleRightClick(e){
        e.preventDefault();
        props.remove(props.name);
    }
    function onInputChange(){
        if (parseInt(inputRef.current.value) < 0) {
            inputRef.current.value = 0;
            return
        }
        inputRef.current.value = Math.round(parseInt(inputRef.current.value))
        props.set(props.name,parseInt(inputRef.current.value))
    }

    return (
        screen.width > 1200 ? 
        <div className='lesson-choose-element-container' onClick={() => handleClick()} onContextMenu={(e) => handleRightClick(e)}>
            <p className='lesson-choose-element-name'>{props.name}</p>
            <p className='lesson-choose-element-value'>{props.value}</p>
        </div>
        :
        <div>
            <div className='lesson-choose-element-container' >
                <p className='lesson-choose-element-name'>{props.name}</p>
                <input ref={inputRef} type='number' className='lesson-choose-element-value-input' onChange={() => onInputChange()}></input>
            </div>
        </div>
    )
}
export default LessonChooseElement