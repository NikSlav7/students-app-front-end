import '../css/MainPageBanner.css'
import '../css/MainPage.css'
function MainPageBanner(props){
    
    return (
        <div className='banner-container'>
            <div className='banner-text-container'>
                <p className='banner-text'>No marks loaded yet :\</p>
            </div>
            <div className="banner-button-container">
                <button className="add-marks-button" onClick={() => props.editMarksheetDialog(true)}>Add new marks</button>
            </div>
        
        </div>
    )
}
export default MainPageBanner;