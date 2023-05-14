import "../css/MarksheetDialog.css"
import ChooseMarkMode from "./ChooseMarkMode";
import ChooseMarkModeContainer from "./ChooseMarkModeContainer";
import FileDropdown from "./FileDropdown";
import { useRef, useState } from "react";
function MarksheetDialog(props){


    const resourceServerDomain = useRef("http://localhost:21212")


    const [customYear, setCustomYear] = useState(props.yearNames.length === 0);

    const dropdownRef = useRef(null)

    const yearInputRef = useRef(null);

    const currentFile = useRef(null);

    const currentYear = useRef(null)
    
    const[showChooseMode, setShowChooseMode] = useState(false)

    const[chosenModeInd, setChosenModeInd] = useState(0);

    const[modeData, setData] = useState([
        {name: "Integer", example: "5, 4, 3, 2, 1 etc", backendName: "int"},
        {name: "Fractional", example: "5.1, 9.8, 7.6 etc", backendName: "double"}
    ]);

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
            if (!response.ok){
                console.log(response)
            }
            else {
                props.addYearName(yearName);
                setCustomYear(false);
            }
        }).catch((error) => {
            alert(error)
        })
    }

    function sendMarks(file, yearName, marksMode){
        let data = new FormData();
        data.append("marks", file);
        data.append("yearName", yearName)
        data.append("language", "ru");
        data.append("marksMode", marksMode)
        fetch(resourceServerDomain.current + "/api/pdf/marks-sheet", {
            method: "post",
            body: data,
            headers:{
                "Authorization": 'Bearer ' + getCookie("STUDENTS_ACCESS_TOKEN")
            }
        }).then((response) =>{
            window.location.reload();
        })
    }

    
    
    function modeChosenConfirm(){
        let curFile = currentFile.current
        console.log(yearInputRef)
        sendMarks(curFile, currentYear.current, modeData[chosenModeInd]['backendName'])
        props.editDialog(false);
    }

    function chooseModeOn(file){
        setShowChooseMode(true);
        currentFile.current  = file;
        currentYear.current = props.yearNames.length === 0 ? yearInputRef.current.value  : getChosenYearVal()
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
            {showChooseMode ? 
            <div className="marks-mode-choose-container-dialog">
                <div className="marks-mode-choose-title-container">
                    <p className="marks-mode-choose-title">What type of marks do you have?</p>
                </div>
                
                <ChooseMarkModeContainer data={modeData} currentChosen={chosenModeInd} changeMode={setChosenModeInd}/>
                
                <div className="marks-mode-choose-button-container">
                    <button className="marks-mode-choose-button" onClick={() => modeChosenConfirm()}>Confirm</button>
                </div>
                
            </div>
             :
            <div className="marks-container-dialog">
                <div className="marksheet-dialog-title-container">
                    <p className="marksheet-dialog-title">Drop your marks here</p>
                </div>
                <div className="marksheet-dialog-file-container">
                    <FileDropdown chooseModeOn={chooseModeOn} getChosenYearVal={getChosenYearVal} yearInputRef={yearInputRef} yearNames={props.yearNames} closeDialog={props.editDialog}/>
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
            </div>}
        </div>
    </div>)
}
export default MarksheetDialog;