import { useEffect, useState, useRef } from "react";
import "../css/MainPage.css"
import LoadData from "./LoadData";
import MarksheetDialog from "./MarksheetDialog";
import { Line } from "react-chartjs-2";
import NavigationBar from "./NavigationBar";
import {Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Ticks, Tooltip} from 'chart.js'
import GraphElement from "./GraphElement";
import YearsAndPeriods from "./YearsAndPeriods";
import AbsenceData from "./AbsenceData";
import AbsenceCalculator from "./AbsenceCalculator";
import MainPageBanner from "./MainPageBanner";
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip)
function MainPage(){

    const[showMarksheetDialog, setShowMarksheetDialog] = useState(false);
    const authServerDomain = useRef("http://localhost:31212")
    const resourceServerDomain = useRef("http://localhost:21212")

    const [uploadOffset, setUploadOffset] = useState(0);
    const[uploadedList, setUploadedList] = useState([]);

    const loadedData = useRef(new Map());

    const[yearNames, setYearNames] = useState([]);
    const [allMarksData, setAllMarksData] = useState([]);


    const[currentYear, setCurrentYear] = useState(null);
    const[currentPeriod, setCurrentPeriod] = useState(null);


    const[flag, setFlag] = useState(false);

    const[yearEditModeOn, setYearEditModeOn] = useState(false);

    const absenceData = useRef(new Map());

    const [absenceDataCur, setAbsenceDataCur] = useState(null);



    function getAspectRatio(){
        return screen.width > 1200 ? 3 : 0.8;
    }


    const data = useRef({
        labels: null,
        datasets: []
      });

      const options = {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio:getAspectRatio(),
        tooltips:{
            enabled: true
        },
        animation: {
            duration: 0
        },
        plugins:{
            tooltip:{
                enabled: true,
                callbacks:{
                    label: function(tooltipItem){
                        let cur = data.current.datasets[tooltipItem.datasetIndex];
                        console.log(tooltipItem);
                        return cur.labels + ": "  + (cur.data[tooltipItem.dataIndex]).toFixed(2);
                    }
                }
            }
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 'Date'
            },
            ticks:{
                minRotation: 60,
                maxRotation:60
            }
          },
          y: {
            display: true,
            title: {
              display: true,
              text: 'Average mark'
            }
          }
        }
      }
      useEffect(() =>{
        const fetchData = async () => {
            if(currentYear !== null && currentPeriod !== null){
                getAbsenceData(currentYear, currentPeriod).then((result) =>{
                    setAbsenceDataCur(result)
                });
            } 
          };
          fetchData();
        
      }, [currentYear, currentPeriod])

      useEffect(()=>{
        getGraphData();
        console.log(flag)
        setFlag(!flag)
        console.log(flag);
      }, [currentYear, currentPeriod])

      async function chooseYear(yearName){
        console.log(loadedData.current.has(yearName))
        if (loadedData.current.has(yearName)){
            setCurrentYear(yearName);
            console.log(loadedData.current.get(yearName));
            const periodName = getFirstKey(loadedData.current.get(yearName));
            setCurrentPeriod(periodName);
            setCurrentYear(yearName);
        }
        else {
            getYearInfo(yearName).then((result) => {
                loadedData.current.set(yearName, result);
                console.log(loadedData.current)
                setCurrentPeriod(getFirstKey(loadedData.current.get((yearName))))
                setCurrentYear(yearName);
                console.log(currentYear + " " + currentPeriod + " " + yearName);
            })
        }
        
      }

      function addYearName(yearName){
        let copy = [...yearNames];
        copy.push(yearName);
        setYearNames(copy);
      }

    function getFirstKey(set) {
        if (set === null || set === undefined) return null;
        let keys = Object.keys(set);
        return keys.length === 0 ? null : keys[0];
      }

      function getAllMarksData(){
        fetch(resourceServerDomain.current + "/api/profile/get-all-mark-averages", {
            method: 'get',
            headers:{
                Authorization: 'Bearer ' + getCookie("STUDENTS_ACCESS_TOKEN")
            }
        }).then((response) => {
            response.json().then((result) =>{
            })
        })
      }


      function getAllYears(){
        fetch(resourceServerDomain.current + "/api/year/get-year-names", {
            method: 'get',
            headers:{
                Authorization: 'Bearer ' + getCookie("STUDENTS_ACCESS_TOKEN")
            }
        }).then((response) => {
            response.json().then((result) =>{
                setYearNames(yearNames => result)
                console.log(result)
                if (result.length !== 0) chooseYear(result[0])
            })
        })
      }

      function getYearInfo(yearName){
         let url = new URL(resourceServerDomain.current + "/api/year/get-year-data");
         let params = {"yearName": yearName}
         Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
         return new Promise((resolve, reject) => {
            fetch(url, {
                method: "get",
                headers:{
                    Authorization: 'Bearer ' + getCookie("STUDENTS_ACCESS_TOKEN")
                }
             }).then((response) => {
                response.json().then((result) => {
                    console.log(result);
                    resolve(result);
                })
             }).catch((error) => {
                reject(error);
             })
             
         })
        
      }
    


    useEffect(()=>{
        const fetchData = async () => {
            let uploads = await getUploads();
            setData(copy);
          };
         fetchData();
         getAllMarksData();
         setGraphSizes()
         getAllYears()

         if (yearNames.length !== 0 && currentYear === '' && currentPeriod === ''){
            chooseYear(yearNames[0]);
         }
    }, [])

    function setGraphSizes(){
        let el = document.getElementById("chart");

    }

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
      }

    async function getUploads(){
        console.log('getting')
        let url = new URL(resourceServerDomain.current + "/api/uploads/get-uploads");
        let params = {"offset": uploadOffset, "limit": 15}
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
        return new Promise((resolve, reject) => {
            fetch(url,{
                method: "get",
                headers:{
                    "Authorization": 'Bearer ' + getCookie("STUDENTS_ACCESS_TOKEN")
                }
            }).then((response) =>{
                if (!response.ok) return;
                response.json().then((result)=>{
                    setUploadedList(uploadedList.concat(result));
                    setUploadOffset(uploadOffset => uploadOffset + result.length);
                    if (result.length === 0) resolve(uploadedList);
                    resolve(result)
                })
            }).catch((error) =>{
                resolve(uploadedList);
            })
        })
    }
    function createCreateLabels(data){
        let labels = new Set();
        for (var i = 0; i < data.length; i++){
            for (var j = 0; j < data[i]['list'].length; j++){
                labels.add(data[i]['list'][j]['date'])
            }
        }
        let labelsArray = Array.from(labels);
        
       
        
        console.log(labelsArray)
        return labelsArray
    }
    function createDataset(data, labels){
        let dataSet = [];
        let labelsPos = 0;
        for (var i = 0; i < data.length; i++){
            labelsPos = 0;
            let curData = [];
            for (var j = 0; j < data[i]['list'].length; j++){
                if (labels[labelsPos] == data[i]['list'][j]['date']) curData.push( data[i]['list'][j]['mark']);
                else curData.push(null);
                labelsPos++;
            }
            let col = createColor(i);
            dataSet.push({
                labels: data[i]['subjectName'],
                data: curData,
                tension: 0.1,
                borderColor: col,
                pointBorderColor: "black",
                pointBackgroundColor: col,
                hidden: false
              })
        }
        return dataSet;
        
    }
    function getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      }
     function createColor(ind){
        let colors = [  "red",  "blue",  "green",  "black",  "orange",  "yellow",  "purple",  "pink",  "brown",  "gray",  "silver",  "gold",  "navy",  "teal",  "maroon",  "olive",  "coral",  "turquoise",  "indigo",  "aquamarine",  "beige",  "chocolate",  "crimson",  "darkblue",  "fuchsia",  "khaki",  "lavender",  "lime",  "magenta",  "mint",  "navajowhite",  "orchid",  "peru",  "plum",  "rosybrown",  "seagreen",  "sienna",  "steelblue",  "tomato",  "violet"]

        return colors[ind % colors.length]
     } 
  
    function editMarksheetDialog(open){
        setShowMarksheetDialog(open);
    }

    function getGraphData(){
        console.log(currentYear + ' ' +  currentPeriod);
        if (currentYear === null || currentPeriod === null){
            let tempData = data.current;
            tempData.labels = [];
            tempData.datasets = [];
            data.current = tempData;
            return data.current;
        }

        console.log(loadedData.current)
        let labelsDates = createCreateLabels(loadedData.current.get(currentYear)[currentPeriod])
        let dataSet = createDataset(loadedData.current.get(currentYear)[currentPeriod], labelsDates);
        let labelsArray = labelsDates.map(el => {
            let date = new Date(el);
            return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes();
        });

        let tempData = data.current;
        console.log(tempData)
        tempData.labels = labelsArray;
        tempData.datasets = dataSet;
        data.current = tempData;
        /*
        let tempData = loadedData.current.get(currentYear)[currentPeriod].map(cur => ({
                labels:cur['subjectName'],
                data: cur['list'],
                tension: 0.1,
                borderColor: 'rgb(0, 221, 255)',
                pointBorderColor: "black",
                pointBackgroundColor: "black"
        })) 
        console.log(tempData);*/
        return data.current;
    }
    function makeid(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+/*-';
        const charactersLength = characters.length;
        let counter = 0;
        for (var i = 0; i < length; i++)
             result += characters.charAt(Math.floor(Math.random() * charactersLength));
        
        return result;
    }

    function changeCurrentYear(name){
        console.log(name)
        chooseYear(name)
    }

    function changeCurrentPeriod(name){
        console.log(name)
        setCurrentPeriod(name)
    }

    function changeLine(lineInd, show){
        console.log(lineInd + " " + show)
        data.current.datasets[lineInd]['hidden'] = show;
        console.log(data.current)
        setFlag(!flag)
    }

    function onEditYearsButtonClick(){
        let needToReload = yearEditModeOn;
        setYearEditModeOn(!yearEditModeOn);
        if (needToReload) window.location.reload();
    }

    async function deleteYear(yearName){
        deleteYearRequest(yearName).then(async (response) =>{
            loadedData.current.delete(yearName);
            let yearsCopy = [...yearNames]
            yearsCopy.splice(yearsCopy.indexOf(yearName), 1);
            if (yearName === currentYear){
                if (yearsCopy.length === 0) {
                    setCurrentPeriod(null);
                    setCurrentYear(null)
                    setYearNames(yearsCopy);
                }

                else {
                    await chooseYear(yearsCopy[0])
                }
            }
            setYearNames(yearsCopy);
        });

    }

    function deleteYearRequest(yearName){
        return new Promise((resolve, reject) => {
            fetch(resourceServerDomain.current + "/api/year/delete-year/" + yearName, {
                method: 'post',
                headers:{
                    Authorization: 'Bearer ' +  getCookie("STUDENTS_ACCESS_TOKEN")
                }
            }).then((response) =>{
                resolve(response);
            }).catch((error) =>{
                reject(error);
            })
        })
    }

    function deletePeriod(periodName, yearName){
        console.log(periodName + " " + yearName)
        deletePeriodRequest(periodName, yearName).then((response) =>{
            delete loadedData.current.get(yearName)[periodName]
            if (periodName !== currentPeriod) {
                setFlag(!flag);
            }
            else {
                chooseYear(yearName);
                setFlag(!flag);
            }
        })
    }


    async function getAbsenceData(yearName, periodName){
        return new Promise((resolve, reject) => {
                if (absenceData.current.get(yearName) !== undefined && absenceData.current.get(yearName)[periodName] !== undefined) resolve(absenceData.current.get(yearName)[periodName]);
            let url = new URL(resourceServerDomain.current + "/api/absence/get-period-absence")
            let params = {"yearName": yearName, 'periodName': periodName}
            let res = null;
            Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
            fetch(url, {
                method: 'get',
                headers: {
                    Authorization: 'Bearer ' +  getCookie("STUDENTS_ACCESS_TOKEN")
                }
            }).then((response) =>{
                response.json().then((result) =>{
                    if (absenceData.current.get(yearName) === undefined) absenceData.current.set(yearName, {});
                    absenceData.current.get(yearName)[periodName] = result;
                    resolve(result)
                })
            })
            }) 
        
       }



    function deletePeriodRequest(periodName, yearName){
        return new Promise((resolve, reject) => {
            fetch(resourceServerDomain.current + '/api/period/delete-period', {
                method: 'post',
                headers:{
                    Authorization: 'Bearer ' +  getCookie("STUDENTS_ACCESS_TOKEN"),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({'yearName': yearName, 'periodName': periodName})
            })
            .then((response) => resolve(response))
            .catch((error) => reject(error))
        })
    }
    function deleteUpload(ind){
        console.log(uploadedList[ind])
        fetch(resourceServerDomain.current + "/api/uploads/delete-upload", {
            method: 'post', 
            headers:{
                Authorization: 'Bearer ' +  getCookie("STUDENTS_ACCESS_TOKEN"),
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({"uploadId": uploadedList[ind]['uploadId']})
        }).then((response) =>{
            window.location.reload();
        })
    }


    return (
        <div className="main-page-container">
            {showMarksheetDialog && <MarksheetDialog addYearName={addYearName} yearNames={yearNames} editDialog={editMarksheetDialog}/>}
            <NavigationBar />
           
                {uploadedList.length === 0 ? 
                    <MainPageBanner editMarksheetDialog={editMarksheetDialog}/> :   
                        <div>
                             <div className="add-marks-button-container">
                                <button className="add-marks-button" onClick={() => editMarksheetDialog(true)}>Add new marks</button>
                             </div>
                            <div className="main-data-container">
                            <LoadData getUploads={getUploads} deleteUpload={deleteUpload} uploadedList={uploadedList}/>
                            <div className="graph-data-container">
                            <div className="periods-container">
                            <div className="edit-years-button-container">
                                        <button onClick={()=>onEditYearsButtonClick()} className="edit-years-button">{yearEditModeOn ? "Save" : "Edit Years"}</button>
                            </div>
                                {loadedData.current.get(currentYear) !== undefined &&  currentYear !== null  &&  <YearsAndPeriods  deletePeriod={deletePeriod} deleteYear={deleteYear} yearEditMode={yearEditModeOn} currentYear={currentYear} currentPeriod={currentPeriod} setCurrentYear={changeCurrentYear} setCurrentPeriod={changeCurrentPeriod} yearNames={yearNames}
                                periodNames={Object.keys(loadedData.current.get(currentYear))}/>}
                            </div>
                            <div className="graph-container">
                                    {currentPeriod !== null && currentYear !==null && <Line key={makeid(5)} flag={flag} id='chart' data={data.current} options={options}>
                                        {console.log('render')}
                                    </Line>}
                            </div>
                            <div className="graph-elements">
                                    {data.current.datasets.map((el, ind) => {
                                    return <GraphElement isShowing={!el['hidden']} changeLine={changeLine} key={makeid(10)}  ind={ind} title={el['labels']} color={el['borderColor']}  />})}
                                    
                            </div>
                        </div>
                </div>
                <div className="absence-data-container">
                    <div className="absence-data-title-container">
                        <p className="absence-data-title">Absence Data</p>
                    </div>
                    {absenceDataCur !== null && absenceDataCur !== undefined && <AbsenceData data={absenceDataCur}/>}
                </div>
            </div>}
            <div className="absence-calculator-container">
                <div className="absence-calculator-header-container">
                    <p className="absence-calculator-header">Absence Calculator</p>
                </div>
                <AbsenceCalculator />
            </div>
        </div>
    )
}
export default MainPage;