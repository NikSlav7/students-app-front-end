import { useState } from "react";
import ChooseMarkMode from "./ChooseMarkMode";

function ChooseMarkModeContainer(props){

   

    function onClick(ind){
        console.log(ind + " " + props.currentChosen)
        props.changeMode(ind);
    }


    return (
        <div className="marks-mode-choose-choose-container">
            {props.data.map((el, ind) => <ChooseMarkMode onClick={onClick} name={el['name']} example={el['example']} ind={ind} chosen={ind === props.currentChosen}/>)}
        </div>
    )
}
export default ChooseMarkModeContainer;