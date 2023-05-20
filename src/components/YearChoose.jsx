import '../css/PeriodChoose.css'
import { useEffect, useRef } from 'react';
function YearChoose(props){


    const deleteRef = useRef(null);


    function onContainerClick(name){
        props.setPeriod(name);
    }

   useEffect(() => {
    if (screen.width < 800 && deleteRef.current !== null) onMouseOverHandler();
   })

   function onMouseOverHandler(){
        deleteRef.current.style.flex = 1;
        deleteRef.current.style.opacity = '100%';
   }
   function onMouseOutHandler(){
    if (screen.width < 800) return;
    deleteRef.current.style.opacity = '0';
    deleteRef.current.style.flex = 0;
}

    return (
        <div>
        {props.yearEditModeOn ? 
            <div  onMouseOut={() => onMouseOutHandler()} onMouseOver={()=> onMouseOverHandler()} className="period-choose-container-remove">
                <p>{props.title}</p>
                <div   ref={deleteRef} className='period-choose-delete-button-container -hidden'>
                    <button onClick={() => props.year === undefined ? props.delete(props.title) : props.delete(props.title, props.year)} className='period-choose-delete-button'>x</button>
                </div>
            </div>
            :
            <div className= {props.chosen ? 'period-choose-container-chosen' : 'period-choose-container'} onClick={() => onContainerClick((props.title))}>
                <p>{props.title}</p>
            </div>
        }
        </div>
    )

}
export default YearChoose;