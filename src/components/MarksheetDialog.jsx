import "../css/MarksheetDialog.css"
import FileDropdown from "./FileDropdown";
import { useRef, useState } from "react";
function MarksheetDialog(props){


    const resourceServerDomain = useRef("http://localhost:21212")


    const [customYear, setCustomYear] = useState(props.yearNames.length === 0);

    const dropdownRef = useRef(null)

    const yearInputRef = useRef();


    function onYearChange(){
        if(getChosenYearVal() === 'Create new') setCustomYear(true);
    }

    function getChosenYearVal(){
        return dropdownRef.current === null ? props.yearNames[0] : dropdownRef.current.options[dropdownRef.current.options.selectedIndex].value;
    }

    function createNewYear(){
        let yearName = document.getElementById("create-custom-year-input").value;
        fetch(resourceServerDomain.current + "/api/year/create-new-year", {
            method:"post",
            headers:{
                Authorization: "Bearer " + getCookie("STUDENTS_ACCESS_TOKEN"),
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({'name':yearName})
        }).then((response) =>{
            props.addYearName(yearName);
            setCustomYear(false);
            console.log(yearName)
        }).catch((error) => {
            alert(error)
        })
    }

    function onCancelClick(){
        setCustomYear(false);
    }

    function getCookie(name){
        let cookie = '; ' + document.cookie;
        let parts = cookie.split("; " + name  + '=')
        if (parts.length === 2) return parts.pop().split(";").shift();
    }

    return (
    <div className="marksheet-dialog-bckg-container">
        <button className="close-dialog-button" onClick={() => props.editDialog(false)}>x</button>
        <div className="marksheet-dialog-container">
            <div className="marksheet-dialog-title-container">
                <p className="marksheet-dialog-title">Drop your marks here</p>
            </div>
            <div className="marksheet-dialog-file-container">
                <FileDropdown getChosenYearVal={getChosenYearVal} yearInputRef={yearInputRef} yearNames={props.yearNames} closeDialog={props.editDialog}/>
            </div>
            <div className="marksheet-dialog-year-container">
                 {customYear ?
                 <div className="create-custom-year-container">
                    <div className="create-custom-year-input-conainer">
                        <input ref={yearInputRef} id='create-custom-year-input' type='text' placeholder="Studying year (custom name)"></input> 
                    </div>
                    <div className="create-custom-year-choose">
                        <button className="create-custom-year-choose-save-button" onClick={() => createNewYear()}>Save year</button>
                        {props.yearNames.length !==0 && <button className="create-custom-year-choose-cancel-button" 
                        onClick={() => onCancelClick()}>Cancel</button>}
                    </div>
                </div>

                 : 
                 <div className="select-year-conainer">
                 <p>Choose Year</p>
                 <select  ref={dropdownRef} type='text' onChange={()=>onYearChange()}>
                        {props.yearNames.map(el => (<option value={el}>{el}</option>))}
                        <option value="Create new">Create new</option>
                </select>
                </div>}
                
            </div>
        </div>
    </div>)
}
export default MarksheetDialog;