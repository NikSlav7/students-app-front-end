import "../css/NavigationBar.css"

function NavigationBar(){


    function logout(){
        document.cookie = "STUDENTS_ACCESS_TOKEN=null; expires=Thu, 01 Jan 1970 00:00:01 GMT"
        document.cookie="STUDENTS_REFRESH_TOKEN=null; expires=Thu, 01 Jan 1970 00:00:01 GMT"
        window.location.reload();
    }

    return (
        <div className="navbar-container">
            <div className="navbar-logo-container">
                <img src={require("../pics/logos/koolitrek/KOOLITREK BLACK ONLY PIC NO BCKG.png")}></img>
            </div>
            <div className="navbar-links-container">
                <div className="navbar-links">
                    <p onClick={() => logout()}>Log Out</p>
                    <p className="navbar-name">Nikita Slavinski</p>
                </div>
            </div>
        </div>
    )
}
export default NavigationBar;
