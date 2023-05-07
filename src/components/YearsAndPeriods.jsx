import '../css/YearsAndPeriods.css'
import YearChoose from './YearChoose';
function YearsAndPeriods(props){

    return (
        <div className="years-and-periods-container">
            <div className="year-container">
                {props.yearNames.map(name => <YearChoose delete={props.deleteYear} yearEditModeOn={props.yearEditMode} chosen={name===props.currentYear} title={name} setPeriod={props.setCurrentYear}/>)}
                
            </div>
            <div className="period-container">
                {props.periodNames.map(name => <YearChoose year={props.currentYear} delete={props.deletePeriod} yearEditModeOn={props.yearEditMode} chosen={name===props.currentPeriod} title={name} setPeriod={props.setCurrentPeriod}/>)}
                
            </div>
        </div>
    )
}
export default YearsAndPeriods;