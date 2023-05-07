import '../css/AbsenceCalculator.css'
import '../css/LessonChoose.css'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { useState } from 'react';
import LessonChoose from './LessonChoose';
import { useRef } from 'react';
import dayjs from 'dayjs';
import { indigo } from '@mui/material/colors';

function AbsenceCalculator(){
    const[fromDate, setFromDate] = useState(dayjs(Date.now()));
    const[toDate, setToDate] = useState(dayjs(Date.now()));
    const[absenceRate, setAbsenceRate] = useState(null);
    const absenceCount = useRef(null);

    function calculateAbsence(fromDate, toDate, lessonsAbsent, dayData){
        let dateFrom = fromDate.toDate();
        let dateTo = toDate.toDate();

        let fromEnd = new Date(dateFrom.getTime() - (dateFrom.getDay() * 60*60*24*1000) + 1000*60*60*24*6);
        let toStart = new Date(dateTo.getTime() - (dateTo.getDay() * 60*60*24*1000))
        
        let keys = ['Sun','Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

        let lessonsCount = 0;

        if (toStart < fromEnd){
            for (var i = dateFrom.getDay(); i <= dateTo.getDay(); i++){
                lessonsCount += dayData[keys[i]];
            }
        }
        else {
            let weeksBetween = Math.max(Math.floor((toStart.getTime() - fromEnd.getTime()-1000*3600*24) / (1000*3600*24*7)), 0);
            let weekSum = keys.reduce((sum, key) => sum+=dayData[key], 0)
            lessonsCount += weeksBetween * weekSum;
            for (var i = dateFrom.getDay(); i <= 6; i++){
                lessonsCount += dayData[keys[i]];
            }
            for (var i = dateTo.getDay(); i >= 0; i--){
                lessonsCount += dayData[keys[i]];
            }
        }
        console.log(lessonsAbsent + " " + lessonsCount)
        return Math.round(lessonsAbsent / lessonsCount * 100)


    }
    const [dayData, setDayData] = useState({
        'Mon': 0, "Tue": 0, "Wed": 0, "Thu": 0, "Fri": 0, "Sat": 0, "Sun": 0
    })
    const [flag, setFlag] = useState(false)

    function addLesson(name){
        let copy = dayData;
        copy[name]++;
        setDayData(copy);
        setFlag(!flag)
    }
    function removeLesson(name){
        let copy = dayData;
        if(copy[name] > 0) copy[name]--;
        setDayData(copy);
        setFlag(!flag)
    }
    function setLesson(name, value){
        let copy = dayData;
        copy[name] = value;
        setDayData(copy);
        setFlag(!flag)
        console.log(copy)
    }

    function calculateButtonClick(){
        if (!checkIfAllDataCorrect()) return;
        var lessonsAbsent = parseInt(absenceCount.current.value);
        var absence = calculateAbsence(fromDate, toDate, lessonsAbsent, dayData);
        setAbsenceRate(absence)
    }
    function checkIfAllDataCorrect(){
        if (absenceCount.current.value === '') {
            alert('Please, enter how many lessons you were absent')
            return false;
        }
        if (toDate < fromDate){
            alert("To Date can't be smaller than From date")
            return false;
        }
        console.log(Object.keys(dayData).reduce((sum, key) => sum+=dayData[key], 0))
        if (Object.keys(dayData).reduce((sum, key) => sum+=dayData[key], 0)=== 0){
            alert("Can't calculate, because you have 0 lessons a week")
            return false;
        }
        return true;
        
    }
    function formatAbsence(absence){
        console.log(absence)
        if(absence === Infinity || isNaN(absence)) return "Error"
        else return absence + "%"
    }
 
    return (
        <div className="absence-calculator">
            <div className='absence-calculator-dates-container'>
                <div className='absence-calculator-from-date-container'>
                    <p className='absence-calculator-from-date-title'>From</p>
                    <div className='absence-calculator-from-date'>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker  value={fromDate} onChange={(newDate) => setFromDate(dayjs(newDate.toDate()))}/>
                    </LocalizationProvider>
                    </div>
                </div>
                <div className='absence-calculator-to-date-container'>
                <p className='absence-calculator-to-date-title'>To </p>
                    <div className='absence-calculator-to-date'>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker value={toDate} minDate={fromDate} onChange={(newDate) => setToDate(dayjs(newDate.toDate()))}/>
                    </LocalizationProvider>
                    </div>
                </div>
            </div>
            <div className='absence-calculator-number-of-lessons-container'>
                <div className='lesson-choose-comment-container'>
                    <p className='lesson-choose-comment'>Set how many lessons you have on each day {window.innerWidth <= 800 ? "" : "Left-Click to add, Right-Click to remove"}</p>
                </div>
                <LessonChoose set={setLesson} add={addLesson} remove={removeLesson} data={dayData}/>
            </div>
            <div className='absence-calculator-absence-count'>
                <p className='absence-calculator-absence-count-header'>How many lessons you were absent?</p>
                <input type="number" ref={absenceCount} className='absence-calculator-absence-count-input'></input>
            </div>
            <div className='absence-calculator-results-container'>
                <div className='absence-calculator-results-button-container'>
                    <button className='absence-calculator-results-button' onClick={() => calculateButtonClick()}>Calculate</button>
                </div>
                <div className='absence-calculator-result-container'>
                    {absenceRate !== null && <p className='absence-calculator-result'>Absence Rate: <strong>{formatAbsence(absenceRate)}</strong></p>}
                </div>
            </div>
        </div>
    )
}
export default AbsenceCalculator;