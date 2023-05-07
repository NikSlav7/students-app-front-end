import { useRef, useState } from "react";
import "../css/FileDropdown.css"
function FileDropdown(props){

    const[onDrag, setOnDrag] = useState(false)

    const inputRef = useRef(null);

    const resourceServerDomain = useRef("http://localhost:21212")
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
      }

    function sendMarks(file, yearName){
        let data = new FormData();
        data.append("marks", file);
        data.append("yearName", yearName)
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

    function checkIfCanSend(){
        if (props.yearNames.length === 0 && props.yearInputRef.current.value === '') return false;
        return true;
    }

    function startDrag(e){
        e.preventDefault();
        setOnDrag(true);
    }
    
    function finishDrag(e){
        e.preventDefault();
        setOnDrag(false);
    }

    function dropHandler(e){


        e.preventDefault();
        setOnDrag(false);
        if (!checkIfCanSend()){
             alert("Type the name of the studying year")
             console.log('cannot')
             return;
        }
        let file = e.dataTransfer.files[0];
        if (file === undefined || file.name.split(".")[1] !== 'pdf'){
            alert("Ooops, that's not a pdf file. Please select pdf file")
            return;
        }
        
        
        let yearName = props.yearNames.length === 0 ? props.yearInputRef.current.value : props.getChosenYearVal();
        sendMarks(file, yearName);
        props.closeDialog(false);
    }
    function chooseHandler(e){
        e.preventDefault();
        if (!checkIfCanSend()){
            alert("Type the name of the studying year")
            console.log('cannot')
            return;
       }
       let yearName = props.yearNames.length === 0 ? props.yearInputRef.current.value : props.getChosenYearVal();
       sendMarks(inputRef.current.files[0], yearName)
        props.closeDialog(false);
    }
    function clickHandler(e){
        inputRef.current.click();
    }

    return(
    <div className={onDrag ? "file-dropdown-container-onDrag" : "file-dropdown-container"}
        onClick={(e) => clickHandler(e)} onDragStart={(e) => startDrag(e)} onDragOver={(e) => startDrag(e)} onDragLeave={(e) => finishDrag(e)} onDrop={(e) => dropHandler(e)}>
        <input onChange={(e) =>chooseHandler(e)} ref={inputRef} type="file" className="file-choose-input" accept=".pdf"></input>
        <p className="file-choose-hint"><strong>Drag</strong> or <strong>choose</strong> the file with your marks. It <strong>should be .pdf</strong> file downloaded from Ekool</p>
    </div>
    )

}
export default FileDropdown;