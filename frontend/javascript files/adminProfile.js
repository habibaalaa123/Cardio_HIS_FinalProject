async function addDoc(first_name, last_name, email, password, phone, position, age, gender){
    try{
        data = {
            email:email,
            first_name:first_name,
            last_name: last_name,
            age: age,
            password:password,
            phone_number : phone,
            position:position,
            gender: gender
        }
    const response = await fetch("http://localhost:4000/api/doctorRegister",{
            method:'POST', 
            headers : {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        const responseData = await response.json()
        if(response.ok){
            alert(responseData.msg)
        }
    }catch(err){
        console.log(err)
    }

}


async function displayInfo(){
    try{
        let adminName = document.getElementById("adminName")
        let adminEmail = document.getElementById("adminEmail")
        let adminImage = document.getElementById('adminImage')

        const response = await fetch("http://localhost:4000/api/getCurrentAdmin",{
            method : 'GET',
            credentials: 'include',
        })
        
        const responseData = await response.json()
        if(response.ok){
            if(responseData.status = "success"){
                adminEmail.innerText = responseData.data.admins.email
                adminName.innerText = `${responseData.data.admins.first_name} ${responseData.data.admins.last_name}`
                adminImage.src = responseData.data.admins.photo
            }else{
                alert(responseData.msg)
            }
        }
    }catch(err){
        console.log(err)
    }
}
async function displayDoctor(){
    try{
        const response = await fetch("http://localhost:4000/api/getDoctorsforSearch",{
            method : 'GET',
            credentials: 'include',
        })
        
        const result = await response.json()
        console.log(result)
        if(result){
            const DoctorList = document.getElementById("DoctorList")
            topPosition = 30 
            for (var i=0;i<result.data.doctors.length;i++){
                var newDoctor = document.createElement("div")
                newDoctor.className = "rectangle2-container";
                newDoctor.style.border="3px solid #EF8481"
                newDoctor.style.boxShadow="5px 5px 25px rgba(0, 0, 0, 0.258)"
                newDoctor.style.borderRadius="20px"
                
                newDoctor.style.marginTop=topPosition +"px"
                
                let isFiredStatus = result.data.doctors[i][0].isfired
                if(!isFiredStatus){
                newDoctor.innerHTML=`
                
                <p style=" font-weight:600 ; font-size : 20px ; text-align:center"> ${result.data.doctors[i][0].first_name} ${result.data.doctors[i][0].last_name}</p>
                <p style="font-weight: 350 ; margin-left:30px" >Email: ${result.data.doctors[i][0].email}</p>
                <p style="font-weight: 350 ; margin-left:30px">Phone Number: ${result.data.doctors[i][1]}</p>
                <p style="font-weight: 350 ; margin-left:30px">position: ${result.data.doctors[i][0].position}</p>
                <p style="font-weight: 350 ; margin-left:30px">Age: ${result.data.doctors[i][0].age}</p>
                
                `
                }
                else{
                    newDoctor.innerHTML=`
                
                    <p style=" font-weight:600 ; font-size : 20px ; text-align:center"> ${result.data.doctors[i][0].first_name} ${result.data.doctors[i][0].last_name}</p>
                    <p style="font-weight: 350 ; margin-left:30px" >Email: ${result.data.doctors[i][0].email}</p>
                    <p style="font-weight: 350 ; margin-left:30px">Phone Number: ${result.data.doctors[i][1]}</p>
                    <p style="font-weight: 350 ; margin-left:30px">position: ${result.data.doctors[i][0].position}</p>
                    <p style="font-weight: 350 ; margin-left:30px">Age: ${result.data.doctors[i][0].age}</p>
                    <p style="font-weight: 1000 ;color: red; margin-left:30px">This Doctor no longer works here</p>
                    
                    `
                }

            
               
                DoctorList.appendChild(newDoctor)
                
                        
                    }
                }
    }catch(err){
        console.log(err)
    }
}


async function displayPatient(){
    try{
        const response = await fetch("http://localhost:4000/api/getPatients",{
            method : 'GET',
            credentials: 'include',
        })
        
        const result = await response.json()
        console.log(result)
        if(result){
            const patientList = document.getElementById("patientList")
            topPosition = 30 
            for (var i=0;i<result.data.patients.length;i++){
                var newPatient = document.createElement("div")
                newPatient.className = "rectangle2-container";
                newPatient.style.border="3px solid #EF8481"
                newPatient.style.boxShadow="5px 5px 25px rgba(0, 0, 0, 0.258)"
                newPatient.style.borderRadius="20px"
                
                newPatient.style.marginTop=topPosition +"px"
                
                newPatient.innerHTML=`
                            
                                    <p style=" font-weight:600 ; font-size : 20px ; text-align:center"> ${result.data.patients[i][0].first_name} ${result.data.patients[i][0].last_name}</p>
                                    <p style="font-weight: 350 ; margin-left:30px" >Email: ${result.data.patients[i][0].email}</p>
                                    <p style="font-weight: 350 ; margin-left:30px">Phone Number: ${result.data.patients[i][1]}</p>
                                    <p style="font-weight: 350 ; margin-left:30px">Age: ${result.data.patients[i][0].age}</p>
                                    
                                `

            
               
                patientList.appendChild(newPatient)
                
                        
                    }
                }
                    // <p>Email: ${result.data.patients[i][0].email}</p>
                    // <p>First Name: ${result.data.patients[i][0].first_name}</p>
                    // <p>Last Name: ${result.data.patients[i][0].last_name}</p>
                    // <p>Phone Number: ${result.data.patients[i][1]}</p>
                    // <p>Age: ${result.data.patients[i][0].age}</p>
    }
      catch(err){
        console.log(err)
    }
}









const addDocBtn = document.getElementById("addDoctorBtn")
if(addDocBtn){
    addDocBtn.addEventListener('click',(event) => {
        event.preventDefault()
        const firstName = document.getElementById("doctorFirstName").value
        const lastName = document.getElementById("doctorLastName").value
        const email = document.getElementById("doctorEmail").value
        const password = document.getElementById("doctorPassword").value
        const phone = document.getElementById("doctorPhone").value
        const position = document.getElementById("doctorPosition").value
        const age = document.getElementById("doctorAge").value
        let gender
        const maleRadio = document.getElementById('maleRadio')
        const femaleRadio = document.getElementById('femaleRadio')
        if (maleRadio.checked){
            gender = 'M'
        }
        else if (femaleRadio.checked){
            gender = 'F'
        }
        else{
            alert("Please Select a Gender")
        }
        
        if(firstName && lastName && email && password && phone && position && age && gender){
            const splited = email.split('@')
            if(splited[1] === "cardiodoc.com"){
                addDoc(firstName,lastName,email,password,phone,position,age,gender)
            }else{
                alert("please enter the true email domain (anything@cardidoc.com)")
            }
        }else{
            alert("please enter the all the data required")
        }
    })
}

let flag = 0
const doctorToEditDropDownList = document.getElementById('doctorsEdit')
doctorToEditDropDownList.addEventListener('click' , async (event)=>{
    event.preventDefault()
    try {
        if (!flag){
        const response = await fetch("http://localhost:4000/api/getDoctors", {
            method: 'GET',
            credentials: 'include',
        })
        const responseData = await response.json()
        if (response.ok) {
            const { data } = responseData
            for (var i = 0; i < data.doctors.length; i++) {
                var opt = document.createElement('option')
                opt.value = `${data.doctors[i][0].email}`
                opt.textContent = `${data.doctors[i][0].first_name} ${data.doctors[i][0].last_name} (${data.doctors[i][0].email})`
                doctorToEditDropDownList.appendChild(opt)
                flag = 1
            }
        }
    }
    } catch (err) {
        console.log(err)
    }
})

const deleteDoctorButton = document.getElementById('deleteDoctor')
deleteDoctorButton.addEventListener('click' , async (event)=>{
    event.preventDefault()
    let selectedDoctor = document.getElementById('doctorsEdit').value
    console.log(selectedDoctor);
    if(selectedDoctor == ''){
        alert('Please Select a doctor')
        return
    }
    const response = await fetch('http://localhost:4000/api/deleteDoctor', {
        method :'DELETE',
        credentials:'include',
        headers:{
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({demail : selectedDoctor}),
        
    })
    const responseData = await response.json()
    console.log(responseData);
    if(response.ok){
        alert(`Doctor ${selectedDoctor} fired`)
    }
    else{
        alert('Error Occured')
    }
})


let editDoctor = document.getElementById('editDoctorBtn')
editDoctor.addEventListener('click' , (event)=>{
    event.preventDefault()
    
    let selectedDoctor = document.getElementById('doctorsEdit').value
    console.log(selectedDoctor);
    if(selectedDoctor == ''){
        alert('Please Select a doctor')
        return
    }
    try {
        localStorage.setItem('doc_email' , `${doctorToEditDropDownList.value}`)
        fetch(`http://localhost:4000/adminEditDoctor`)
            .then(() => window.location.href = '/adminEditDoctor')
    } catch (err) {
        console.log(err)
    }
})






async function searchPatient(){
    try{
        
        const searchbtn= document.getElementById("searchPatientBtn")
        
        if(searchbtn){
            searchbtn.addEventListener('click',async(event)=>{
                const patientList = document.getElementById("patientList")
                event.preventDefault();
                patientList.innerHTML = '';
                Name = document.getElementById("searchPatientTxt").value.trim();
                if(Name){
                patientName = Name.split(' ');
                console.log("1")
                if(patientName.length>1){
                    console.log("2")
                    const [fName,lName]=patientName
                    const response = await fetch("http://localhost:4000/api/searchPatient",{
                        method : 'post',
                        headers:{
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ fName, lName }),
                        
                        
                    })
                    console.log("3")
                    const result = await response.json();
                    console.log(result);
                    
                    if(result && result.data){
                        // console.log(result.data)
                        topPosition = 30
                        for (var i=0 ;i<result.data.length;i++){
                            console.log("patient")
                            var newPatient = document.createElement("div")
                            newPatient.className = "rectangle2-container";
                            newPatient.style.border="3px solid #EF8481"
                            newPatient.style.boxShadow="5px 5px 25px rgba(0, 0, 0, 0.258)"
                            newPatient.style.borderRadius="20px"
                            
                            newPatient.style.marginTop=topPosition +"px"
                            
                            newPatient.innerHTML=`
                            
                            <p style=" font-weight:600 ; font-size : 20px ; text-align:center"> ${result.data[i].first_name} ${result.data[i].last_name}</p>
                            <p style="font-weight: 350 ; margin-left:30px" >Email: ${result.data[i].email}</p>
                            <p style="font-weight: 350 ; margin-left:30px">Phone Number: ${result.data[i].phone_numbers[0]}</p>
                            <p style="font-weight: 350 ; margin-left:30px">Age: ${result.data[i].age}</p>
                                        
                                    `
                                    
                                    
                                    
                                    patientList.appendChild(newPatient)
                                }
                            }
                            else{
                                var newPatient = document.createElement("div")
                                newPatient.className = "rectangle2-container";
                                newPatient.style.border="3px solid #EF8481"
                                newPatient.style.boxShadow="5px 5px 25px rgba(0, 0, 0, 0.258)"
                                newPatient.style.borderRadius="20px"
                                
                                newPatient.style.marginTop= 30 +"px"
                                
                                newPatient.innerHTML=`
                                
                                <p style=" font-weight:600 ; font-size : 17px ; text-align:center">No patient is found withn this name</p>
                                
                                
                                `
                                
                                
                                
                                patientList.appendChild(newPatient)
                            }
                            
                        }
                        else{
                            console.log("else")
                            const [fName]=patientName
                            console.log(fName)
                            const lName=""
                            const response = await fetch("http://localhost:4000/api/searchPatient",{
                                method : 'post',
                                credentials: 'include',
                                headers:{
                                    'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({fName,lName}),
                        

                    })
                    
                    const result = await response.json();
                    console.log(result);
                    
                    const patientList = document.getElementById("patientList")
                    if(result && result.data){
                        
                        topPosition = 30
                        for (var i=0 ;i<result.data.length;i++){
                            console.log("patient")
                            var newPatient = document.createElement("div")
                            newPatient.className = "rectangle2-container";
                            newPatient.style.border="3px solid #EF8481"
                            newPatient.style.boxShadow="5px 5px 25px rgba(0, 0, 0, 0.258)"
                            newPatient.style.borderRadius="20px"
                            
                            newPatient.style.marginTop=topPosition +"px"
                            
                            newPatient.innerHTML=`
                            
                            <p style=" font-weight:600 ; font-size : 20px ; text-align:center"> ${result.data[i].first_name} ${result.data[i].last_name}</p>
                            <p style="font-weight: 350 ; margin-left:30px" >Email: ${result.data[i].email}</p>
                            <p style="font-weight: 350 ; margin-left:30px">Phone Number: ${result.data[i].phone_numbers[0]}</p>
                            <p style="font-weight: 350 ; margin-left:30px">Age: ${result.data[i].age}</p>
                            
                            `
                            
                            
                            
                            patientList.appendChild(newPatient)
                            
                        }
                    }
                    else{
                        var newPatient = document.createElement("div")
                        newPatient.className = "rectangle2-container";
                        newPatient.style.border="3px solid #EF8481"
                        newPatient.style.boxShadow="5px 5px 25px rgba(0, 0, 0, 0.258)"
                        newPatient.style.borderRadius="20px"
                        
                        newPatient.style.marginTop= 30 +"px"
                        
                        newPatient.innerHTML=`
                        
                        <p style=" font-weight:600 ; font-size : 17px ; text-align:center">No patient is found withn this name</p>
                        
                        
                        `
                        
                        
                        
                        patientList.appendChild(newPatient)
                    }    
                }
            }
        
            else{
                const response = await fetch("http://localhost:4000/api/getPatients",{
                    method : 'GET',
                    credentials: 'include',
                })
                
                const result = await response.json()
                console.log(result)
                if(result){
                    const patientList = document.getElementById("patientList")
                    topPosition = 30 
                    for (var i=0;i<result.data.patients.length;i++){
                        var newPatient = document.createElement("div")
                        newPatient.className = "rectangle2-container";
                        newPatient.style.border="3px solid #EF8481"
                        newPatient.style.boxShadow="5px 5px 25px rgba(0, 0, 0, 0.258)"
                        newPatient.style.borderRadius="20px"
                        
                        newPatient.style.marginTop=topPosition +"px"
                        
                        newPatient.innerHTML=`
                        
                        <p style=" font-weight:600 ; font-size : 20px ; text-align:center"> ${result.data.patients[i][0].first_name} ${result.data.patients[i][0].last_name}</p>
                        <p style="font-weight: 350 ; margin-left:30px" >Email: ${result.data.patients[i][0].email}</p>
                        <p style="font-weight: 350 ; margin-left:30px">Phone Number: ${result.data.patients[i][1]}</p>
                        <p style="font-weight: 350 ; margin-left:30px">Age: ${result.data.patients[i][0].age}</p>
                        
                        `
                        
                        
                        
                        patientList.appendChild(newPatient)
                        
                        
                    }
                }
                // <p>Email: ${result.data.patients[i][0].email}</p>
                // <p>First Name: ${result.data.patients[i][0].first_name}</p>
                // <p>Last Name: ${result.data.patients[i][0].last_name}</p>
                // <p>Phone Number: ${result.data.patients[i][1]}</p>
                // <p>Age: ${result.data.patients[i][0].age}</p>
            }
            
        })
        
    }
}
catch(error){
    console.log(error)
}
}







async function searchDoctor(){
    try{
        
        const searchbtn= document.getElementById("searchDoctorBtn")
        
        if(searchbtn){
            searchbtn.addEventListener('click',async(event)=>{
                const DoctorList = document.getElementById("DoctorList")
                event.preventDefault();
                DoctorList.innerHTML = '';
                Name = document.getElementById("searchDoctorTxt").value.trim();
                if(Name){
                    DoctorName = Name.split(' ');
                    console.log("1")
                    if(DoctorName.length>1){
                        console.log("2")
                        const [fName,lName]=DoctorName
                        const response = await fetch("http://localhost:4000/api/searchDoctor",{
                            method : 'post',
                            headers:{
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ fName, lName }),
                            
                            
                        })
                        console.log("3")
                        const result = await response.json();
                        console.log(result);
                        
                        if(result && result.data){
                            // console.log(result.data)
                            topPosition = 30
                            for (var i=0 ;i<result.data.length;i++){
                                console.log("doctor")
                                var newDoctor = document.createElement("div")
                                newDoctor.className = "rectangle2-container";
                                newDoctor.style.border="3px solid #EF8481"
                                newDoctor.style.boxShadow="5px 5px 25px rgba(0, 0, 0, 0.258)"
                                newDoctor.style.borderRadius="20px"
                                
                                newDoctor.style.marginTop=topPosition +"px"
                                let isFired = result.data[i].isfired
                                if(!isFired){
                                newDoctor.innerHTML=`
                                
                                <p style=" font-weight:600 ; font-size : 20px ; text-align:center"> ${result.data[i].first_name} ${result.data[i].last_name}</p>
                                <p style="font-weight: 350 ; margin-left:30px" >Email: ${result.data[i].email}</p>
                                <p style="font-weight: 350 ; margin-left:30px">Phone Number: ${result.data[i].phone_numbers[0]}</p>
                                        <p style="font-weight: 350 ; margin-left:30px">position: ${result.data[i].position}</p>
                                        <p style="font-weight: 350 ; margin-left:30px">Age: ${result.data[i].age}</p>
                                        
                                        `
                                }
                                else{
                                    newDoctor.innerHTML=`
                                
                                <p style=" font-weight:600 ; font-size : 20px ; text-align:center"> ${result.data[i].first_name} ${result.data[i].last_name}</p>
                                <p style="font-weight: 350 ; margin-left:30px" >Email: ${result.data[i].email}</p>
                                <p style="font-weight: 350 ; margin-left:30px">Phone Number: ${result.data[i].phone_numbers[0]}</p>
                                <p style="font-weight: 350 ; margin-left:30px">position: ${result.data[i].position}</p>
                                <p style="font-weight: 350 ; margin-left:30px">Age: ${result.data[i].age}</p>
                                <p style="font-weight: 1000 ;color: red; margin-left:30px">This Doctor no longer works here</p>
                                        `
                                    
                                }
                                        
                                        
                                        DoctorList.appendChild(newDoctor)
                                    }
                                }
                                else{
                                    var newDoctor = document.createElement("div")
                                    newDoctor.className = "rectangle2-container";
                                    newDoctor.style.border="3px solid #EF8481"
                                    newDoctor.style.boxShadow="5px 5px 25px rgba(0, 0, 0, 0.258)"
                                    newDoctor.style.borderRadius="20px"
                        
                                    newDoctor.style.marginTop= 30 +"px"
                                    
                                    newDoctor.innerHTML=`
                                    
                                    <p style=" font-weight:600 ; font-size : 17px ; text-align:center">No doctor is found with this name</p>
                                    
                                    
                                    `
                                    
                                    
                                    
                                    DoctorList.appendChild(newDoctor)
                                }
                                
                            }
                            else{
                                console.log("else")
                                const [fName]=DoctorName
                                console.log(fName)
                                const lName=""
                                const response = await fetch("http://localhost:4000/api/searchDoctor",{
                        method : 'post',
                        credentials: 'include',
                        headers:{
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({fName,lName}),
                        
                        
                    })
                    
                    const result = await response.json();
                    console.log(result);
                    
                    const DoctorList = document.getElementById("DoctorList")
                    if(result && result.data){
                        
                        topPosition = 30
                        for (var i=0 ;i<result.data.length;i++){
                            console.log("doctor")
                            var newDoctor = document.createElement("div")
                            newDoctor.className = "rectangle2-container";
                            newDoctor.style.border="3px solid #EF8481"
                            newDoctor.style.boxShadow="5px 5px 25px rgba(0, 0, 0, 0.258)"
                            newDoctor.style.borderRadius="20px"
                            
                            newDoctor.style.marginTop=topPosition +"px"
                            let firedStatus = result.data[i].isfired
                            if(!firedStatus){
                            newDoctor.innerHTML=`
                            
                            <p style=" font-weight:600 ; font-size : 20px ; text-align:center"> ${result.data[i].first_name} ${result.data[i].last_name}</p>
                            <p style="font-weight: 350 ; margin-left:30px" >Email: ${result.data[i].email}</p>
                            <p style="font-weight: 350 ; margin-left:30px">Phone Number: ${result.data[i].phone_numbers[0]}</p>
                            <p style="font-weight: 350 ; margin-left:30px">position: ${result.data[i].position}</p>
                            <p style="font-weight: 350 ; margin-left:30px">Age: ${result.data[i].age}</p>
                            
                            `}
                            else{
                                newDoctor.innerHTML=`
                                
                                <p style=" font-weight:600 ; font-size : 20px ; text-align:center"> ${result.data[i].first_name} ${result.data[i].last_name}</p>
                                <p style="font-weight: 350 ; margin-left:30px" >Email: ${result.data[i].email}</p>
                                <p style="font-weight: 350 ; margin-left:30px">Phone Number: ${result.data[i].phone_numbers[0]}</p>
                                <p style="font-weight: 350 ; margin-left:30px">position: ${result.data[i].position}</p>
                                <p style="font-weight: 350 ; margin-left:30px">Age: ${result.data[i].age}</p>
                                <p style="font-weight: 1000 ;color: red; margin-left:30px">This Doctor no longer works here</p>
                                        `
                            }
                            
                            
                            
                            DoctorList.appendChild(newDoctor)
                            
                        }
                    }
                    else{
                        var newDoctor = document.createElement("div")
                        newDoctor.className = "rectangle2-container";
                        newDoctor.style.border="3px solid #EF8481"
                        newDoctor.style.boxShadow="5px 5px 25px rgba(0, 0, 0, 0.258)"
                        newDoctor.style.borderRadius="20px"
                        
                        newDoctor.style.marginTop= 30 +"px"
                        
                        newDoctor.innerHTML=`
                        
                        <p style=" font-weight:600 ; font-size : 17px ; text-align:center">No doctor is found with this name</p>
                        
                        
                        `
                        
                        
                       
                        DoctorList.appendChild(newDoctor)
                    }    
                }
            }
            
            else{
                const response = await fetch("http://localhost:4000/api/getDoctorsforSearch",{
                    method : 'GET',
                    credentials: 'include',
                })
                
                const result = await response.json()
                console.log(result)
                if(result){
                    const DoctorList = document.getElementById("DoctorList")
                    topPosition = 30 
                    for (var i=0;i<result.data.doctors.length;i++){
                        var newDoctor = document.createElement("div")
                        newDoctor.className = "rectangle2-container";
                        newDoctor.style.border="3px solid #EF8481"
                        newDoctor.style.boxShadow="5px 5px 25px rgba(0, 0, 0, 0.258)"
                        newDoctor.style.borderRadius="20px"
                        
                        newDoctor.style.marginTop=topPosition +"px"
                        let isFiredStatus = result.data.doctors[i][0].isfired
                        if(!isFiredStatus){
                        newDoctor.innerHTML=`
                        
                        <p style=" font-weight:600 ; font-size : 20px ; text-align:center"> ${result.data.doctors[i][0].first_name} ${result.data.doctors[i][0].last_name}</p>
                        <p style="font-weight: 350 ; margin-left:30px" >Email: ${result.data.doctors[i][0].email}</p>
                        <p style="font-weight: 350 ; margin-left:30px">Phone Number: ${result.data.doctors[i][1]}</p>
                        <p style="font-weight: 350 ; margin-left:30px">position: ${result.data.doctors[i][0].position}</p>
                        <p style="font-weight: 350 ; margin-left:30px">Age: ${result.data.doctors[i][0].age}</p>
                        
                        `
                        }
                        else{
                            newDoctor.innerHTML=`
                        
                            <p style=" font-weight:600 ; font-size : 20px ; text-align:center"> ${result.data.doctors[i][0].first_name} ${result.data.doctors[i][0].last_name}</p>
                            <p style="font-weight: 350 ; margin-left:30px" >Email: ${result.data.doctors[i][0].email}</p>
                            <p style="font-weight: 350 ; margin-left:30px">Phone Number: ${result.data.doctors[i][1]}</p>
                            <p style="font-weight: 350 ; margin-left:30px">position: ${result.data.doctors[i][0].position}</p>
                            <p style="font-weight: 350 ; margin-left:30px">Age: ${result.data.doctors[i][0].age}</p>
                            <p style="font-weight: 1000 ;color: red; margin-left:30px">This Doctor no longer works here</p>
                            
                            `
                        }
                        
                        
                        DoctorList.appendChild(newDoctor)
                        
                                
                    }
                }
                
            }
            
        })
        
    }
}
catch(error){
    console.log(error)
}
}



async function getStatistics(){
        try{
            let numberPatients = document.getElementById("noofpatients");
            let numberDoctors = document.getElementById("noofdoctors");
            let upcomingReservations = document.getElementById("upcoming-reservations");
            let weeklyAppointments = document.getElementById("weekly-appointments");
            let monthlyAppointments = document.getElementById("monthly-appointments");

            const response = await fetch("http://localhost:4000/api/getStatistics",{
                method : 'GET',
                credentials: 'include',
            })
            const result= await response.json()
            console.log(result.data)
            numberPatients.innerText = result.data.num_of_patients;
            numberDoctors.innerText = result.data.num_of_doctors;
            upcomingReservations.innerText = result.data.upcoming_appointments;
            weeklyAppointments.innerText = result.data.last_week_appointments;
            monthlyAppointments.innerText = result.data.last_month_appointments; 
            const parentElement = document.getElementById("statisticsCard") 
            console.log(result.data.medicine.rows)
            for(let i = 0; i < result.data.medicine.rows.length; i++){
                const element = document.createElement('div')
                element.innerHTML = `<div class="col-lg-12" id="time" >
                                    <div class="calendar-item "
                                        style="background-color: var(--text-div-background); display: block;text-align: left; border:3px solid var(--text-purple); width:430px; border-radius:15px">
                                        <p style="color: var(--text-orange); margin-top:8px;" class="timeHead" id='timeHeader'>medicine name: ${result.data.medicine.rows[i].medicine_name}<br>  medicine quantity: ${result.data.medicine.rows[i].medicine_quantity} <br>cost:  ${result.data.medicine.rows[i].cost} </p>
                                    </div>
                                </div>`
                parentElement.append(element)
            }
            
        }catch(error){
            console.log(error)
        }

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

async function getHomePage(){
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
}
logout();
getHomePage();
displayDoctor();
displayPatient()
searchDoctor();
searchPatient();
displayInfo();
getStatistics();