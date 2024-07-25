


const changeBtn = document.getElementById("change")
const doneBtn = document.getElementById("back")

async function changePassword(data){
    try{
        const response = await fetch("http://localhost:4000/api/changePassword",{
            method: 'PATCH',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        const responseData = await response.json()
        alert(responseData.msg)
    }catch(err){
        console.log(err)
    }
    
}

if(changeBtn){
    let oldPasswordElement = document.getElementById("oldPassword");
    let newPasswordElement = document.getElementById("newPassword");
    changeBtn.addEventListener('click',(event) =>{
        event.preventDefault()
        let oldPassword = oldPasswordElement.value;
        let newPassword = newPasswordElement.value;
        data = {
            old_password:oldPassword,
            new_password:newPassword,
            user_type:"PATIENT"
        }
        changePassword(data)
    })
}

if(doneBtn){
    doneBtn.addEventListener('click',(event) => {
        event.preventDefault()
        fetch("http://localhost:4000/patientProfile")
        .then(() => window.location.href = '/patientProfile')
    })
}


const profile_button = document.getElementById("profile")
if(profile_button){
profile_button.addEventListener('click', (event) => {
    event.preventDefault()
    fetch("http://localhost:4000/patientProfile")
        .then(() => window.location.href = '/patientProfile')
})
}

async function logout(){
    const logoutBtn =document.getElementById("logout")
if(logoutBtn){
    logoutBtn.addEventListener('click', async (event) => {
        event.preventDefault()

        const response = await fetch('http://localhost:4000/api/logout', {
            method: 'GET',
            credentials: 'include',
        })
        const result = await response.json()
        console.log(result.msg)
        if(response.ok){

        fetch("http://localhost:4000/login")
            .then(() => window.location.href = '/login')
        }
    })
}
}

const hmBtn = document.getElementById("home")
    if(hmBtn)
        hmBtn.addEventListener('click', async(event) => {
            event.preventDefault()
            const response = await fetch('http://localhost:4000/api/logout', {
                method: 'GET',
                credentials: 'include',
            })
            const result = await response.json()
            console.log(result.msg)
            if(response.ok){
            fetch("http://localhost:4000/homePage")
                .then(() => window.location.href = '/homePage')
            }
        })

logout();
console.log(doneBtn)