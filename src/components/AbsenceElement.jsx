import '../css/AbsenceData.css'
function AbsenceElement(props){

    return (
        <div className="absence-element-container">
            <div className='absence-element-data-container'>
                <p className='absence-element-data-container-name'>{props.title + ":"}</p>
                <p className='absence-element-data-container-data'>{props.number}</p>
            </div>
        </div>
    )
}
export default AbsenceElement;