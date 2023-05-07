export class BackendApiSender{
       constructor(authServerDomain, resourceServerDomain) {
        this.authServerDomain = authServerDomain;
        this.resourceServerDomain = resourceServerDomain;
    }

    renewToken(url , token){
        console.log(token)
        return new Promise((resolve, reject) => {
            fetch(url, {
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({"refreshToken": token})
            }).then((response) => {
                response.json().then((result) => {
                    if (!response.ok) {
                        reject(response);
                        window.location.pathname = "/login"
                    }
                    let date = new Date();
                    document.cookie = "STUDENTS_ACCESS_TOKEN=" + result['accessToken'] + "; expires=" + new Date(date.getTime() + 1000*60*60*24).toUTCString(); 
                    document.cookie = "STUDENTS_REFRESH_TOKEN=" + result['refreshToken'] + "; expires=" + new Date(date.getTime() + 1000*60*60*24*7).toUTCString();
                    window.location.pathname = "/main";
                })
                resolve(result)
            }).catch((error) =>{
                reject(error);
                window.location.pathname = "/login"

            })
        })
    }
    getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

  
    sendRequest(username, password, url){
        return new Promise((resolve, reject) =>{
            fetch(url, {
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                },
                body:JSON.stringify({'username': username, 'password': password})
            }).then((response) =>{
                if (!response.ok){
                    reject(response);
                    return;
                }
                 response.json().then((result) => {
                    let date = new Date();
                    console.log(result['accessToken'] + " " + result['refreshToken'])
                    document.cookie = "STUDENTS_ACCESS_TOKEN=" + result['accessToken'] + "; expires=" + new Date(date.getTime() + 1000*60*60*24).toUTCString(); 
                    document.cookie = "STUDENTS_REFRESH_TOKEN=" + result['refreshToken'] + "; expires=" + new Date(date.getTime() + 1000*60*60*24*7).toUTCString();
                    window.location.pathname = "/main";
                    
                })
                resolve(response)
            }).catch((error) =>{
                console.log(error)
                reject(error);
            })
        })
    }

    register(url, body){
        fetch(url, {
            method: "post",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        }).then((response) =>{
            if (response.ok) window.location.pathname = "/login"
        })
    }

    checkToken(url, token){
        fetch(url, {
            method: "post",
            headers:{
                "Access-Token": token
            }
        }).then((response) =>{
            console.log(response.ok)
            if (!response.ok){
                this.renewToken(this.authServerDomain + "/api/auth/renew", this.getCookie("STUDENTS_REFRESH_TOKEN"))
            }
        }).catch((error) =>{
            this.renewToken(this.authServerDomain + "/api/auth/renew", this.getCookie("STUDENTS_REFRESH_TOKEN"))
        })
    }
}
  