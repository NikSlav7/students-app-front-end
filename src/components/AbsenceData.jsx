import '../css/AbsenceData.css'
import AbsenceElement from './AbsenceElement';
function AbsenceData(props){

    return (
    <div className='absence-data-data-container'>
        {Object.keys(props.data).map(key => <AbsenceElement title={key} number={props.data[key]}/>)}
    </div>)
}
export default AbsenceData;