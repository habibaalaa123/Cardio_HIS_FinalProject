const backToLogin = document.getElementById("Registerlogin")
const signUp = document.getElementById("RegisterSignup")

// form 


// const maleRadio = document.getElementById("maleRadio")
// const femaleRadio = document.getElementById("femaleRadio")
//const selectedRadio = document.querySelector('input[name = Gender]:checked').value

if(backToLogin){
    backToLogin.addEventListener('click',(event) =>{
        event.preventDefault()
        fetch("http://localhost:4000/register")
        .then(() => window.location.href = '/login')
    })
}

if(signUp){
    signUp.addEventListener('click', (event) =>{
        event.preventDefault()
        const firstName = document.getElementById("firstName").value
        const lastName = document.getElementById("lastName").value
        const email = document.getElementById("RegisterEmail").value
        const phone = document.getElementById("RegisterPhone").value
        const password = document.getElementById("RegisterPassword").value
        const age = document.getElementById("RegisterAge").value
        const maleRadio = document.getElementById('maleRadio')
        const femaleRadio = document.getElementById('femaleRadio')
        let gender
        if (maleRadio.checked){
            gender = 'M'
        }
        else if (femaleRadio.checked){
            gender = 'F'
        }
        else{
            alert("Please Select a Gender")
        }
        try{
            if(firstName && lastName && email && password && phone && gender){
                RegisterUser(email, firstName, lastName, age, password,phone, gender)
            }else{
                alert("please fill all the form")
            }
        }catch(err){
            console.log(err)
        }
        
    })
}

const RegisterUser = async (email, firstName, lastName, age, password,phone , gender) =>{
    try{
        const UserData = {
            email:email,
            first_name:firstName,
            last_name:lastName,
            age:age,
            password:password,
            phone_number : phone,
            gender:gender
        }
        const testEmail = UserData.email.split('@')
        console.log(testEmail)
        if(testEmail.length === 2){
            if(testEmail[1] === "cardiodoc.com" || testEmail[1] === "cardioadmin.com"){
                alert("you cannot use this domain")
                return
            }
        }else{
            alert("please enter a valid email")
            return
        }
        const response = await fetch("http://localhost:4000/api/PatientRegister", {
            method : "POST", 
            headers : {
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(UserData)
        })
        const responseData = await response.json()
        if(responseData.status = "success"){
            alert(responseData.msg)
            await fetch("http://localhost:4000/login")
            .then(() => window.location.href = '/login')
        }else{
            alert(responseData.msg)
        }
    }catch(err){
        console.log(err)
    }
}
