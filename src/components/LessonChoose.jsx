import { useState } from 'react';
import '../css/LessonChoose.css'
import LessonChooseElement from './LessonChooseElement';
function LessonChoose(props){


    
    return (
        <div className="lesson-choose-container">
            {props.data !== null &&  Object.keys(props.data).map(key => <LessonChooseElement set={props.set} add={props.add} remove={props.remove} name={key} value={props.data[key]}/>)}
        </div>
    )
}
export default LessonChoose;