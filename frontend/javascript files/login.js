let loginBtn = document.getElementById("loginBtn")
let regsterBtn = document.getElementById("toSignUp")
let email = document.getElementById("email_input").value
let passwword = document.getElementById("password_input").value


// login 
if(loginBtn){
    loginBtn.addEventListener('click', (event) =>{
        event.preventDefault()
        email = document.getElementById("email_input").value
        passwword = document.getElementById("password_input").value
        try{   
            if(email && passwword){
                const emailParts  = email.split('@')
                if(emailParts.length === 2){
                    // doctor
                    if(emailParts[1] === "cardiodoc.com"){
                        login(email, passwword, "DOCTOR")
                    }
                    // admin
                    else if(emailParts[1] === "cardioadmin.com"){
                        login(email, passwword, "ADMIN")
                    }
                    // patient
                    else{
                        login(email, passwword, "PATIENT")
                    }
                }else{
                    alert("please enter a valid email")
                }
            }else{
                alert("please enter your email and password")
            }
        }
        catch(err){
            console.log(err)
        }
    })
}


if(regsterBtn){
regsterBtn.addEventListener('click', (event) =>{
    event.preventDefault()
    fetch("http://localhost:4000/register")
    .then(() => window.location.href = '/register')
})
}


async function login(email, password, user){
    try{   
         data = {
            email: email, 
            password: password,
            user_type:user
        }
        const response = await fetch("http://localhost:4000/api/login", {
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        if(response.ok){
            const responseData = await response.json()
            if(responseData.status = "success"){
                //alert(responseData.msg)
                // send to doctor page
                if(user === "DOCTOR"){
                    fetch("http://localhost:4000/doctorProfile")
                    .then(() => window.location.href = '/doctorProfile')
                }else if (user === "PATIENT"){
                    fetch("http://localhost:4000/patientProfile")
                    .then(() => window.location.href = '/patientProfile')
                }else{
                    fetch("http://localhost:4000/adminProfile")
                    .then(() => window.location.href = '/adminProfile')
                }
            }else{
                alert(responseData.msg)
            }
        }else{
            const errorData = await response.json()
            throw new Error(`${JSON.stringify(errorData)}`)
        }
        
    }catch(err){
        console.log(err)
        alert("wrong email or paswword")
    }
}
