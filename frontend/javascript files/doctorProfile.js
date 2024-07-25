let nameText = document.getElementById("doctorName")
let email = document.getElementById("DoctorEmail")
let Position = document.getElementById("doctorPosition")
let age = document.getElementById("doctorAge")
let profileImage = document.getElementById('patient-image')
let doctorPosition = document.getElementById('doctorPosition')
let doctorComingApp = document.getElementById('doctorComingApp')
let doctorPostApp = document.getElementById('doctorPostApp')

async function getDocProfile() {
    try {
        const response = await fetch("http://localhost:4000/api/getCurrentDoctor", {
            method: 'GET',
            credentials: 'include',
        })
        const responseInfo = await fetch("http://localhost:4000/api/getAppointmentsInfoDoctors", {
            method: 'GET',
            credentials: 'include',
        })
        if (response.ok) {
            const infoResponseData = await responseInfo.json()
            const responseData = await response.json()
            if (responseData.status === "success") {
                nameText.innerText = `DR ${responseData.data.doctors.first_name} ${responseData.data.doctors.last_name}`
                email.innerText = `${responseData.data.doctors.email}`
                age.innerText = `${responseData.data.doctors.age}`
                doctorPosition.innerText = `${responseData.data.doctors.position}`
                if (responseData.data.doctors.photo) {
                    profileImage.src = responseData.data.doctors.photo
                }
                else{
                    profileImage.src = "Photos/profile-icon.png"
                }

                if (responseData.data.phone_numbers.length > 1) {

                    const num1 = document.getElementById("doctorPhoneNumber1");
                    const num2 = document.getElementById("doctorPhoneNumber2");
                    num1.innerText = `${responseData.data.phone_numbers[0].phone_numbers}`;
                    num2.innerText = `${responseData.data.phone_numbers[1].phone_numbers}`;
                } else if (responseData.data.phone_numbers.length === 1) {

                    const num1 = document.getElementById("doctorPhoneNumber1");
                    const num2 = document.getElementById("doctorPhoneNumber2");
                    num1.innerText = `${responseData.data.phone_numbers[0].phone_numbers}`;
                    num2.innerText = ` `;
                } else {
                    const num1 = document.getElementById("doctorPhoneNumber1");
                    const num2 = document.getElementById("doctorPhoneNumber2");
                    num1.innerText = `no phones`;
                    num2.innerText = ` `;
                }
            } else {
                console.log(responseData.msg)
            }
            if (infoResponseData.status === "success") {
                doctorComingApp.innerText = `${infoResponseData.data.upcoming}`
                doctorPostApp.innerText = `${infoResponseData.data.post}`
            } else {
                console.log(infoResponseData.msg)
            }

        } else {

        }

    } catch (err) {
        console.log(err)
    }
}

async function getAndDisplayMessages() {
    try {
        const response = await fetch("http://localhost:4000/api/getMessages", {
            method: 'GET',
            credentials: 'include',
        })
        const responseData = await response.json();
        const messagesDiv = document.getElementById("messages")
        if(responseData.msg==="No messages found"){
            messagesDiv.innerHTML=`<p style=" font-weight:600 ; font-size : 17px ; text-align:center; color: var(--text-blue);"> No messages yet</p>`
          }
        if (response.ok) {
            const { data } = responseData
            for (let i = 0; i <= data.messages.length; i++) {
                var senderParagraphTest = document.createElement('div')
                const dateText = `${data.messages[i].date}`.slice(0, 10)
                const dateTime = `${data.messages[i].time}`.slice(0, 5)
                senderParagraphTest.innerHTML = `<div class="calendar-item" style="background-color: var(--text-div-background);   border:2px solid var(--text-purple); border-radius: 15px">
                <p style="color: var(--text-blue);" >message from : ${data.messages[i].sender} <br> date : ${dateText} <br> time : ${dateTime} <br> "${data.messages[i].content}" </p>
                <p style ="color: var(--text-blue);"></p>
            </div>`
                messagesDiv.appendChild(senderParagraphTest)
            }
        }
    } catch (err) {
        console.log(err)
    }
}

async function FillSelectPatients() {
    try {
        const response = await fetch("http://localhost:4000/api/getPatients", {
            method: 'GET',
            credentials: 'include',
        })
        const responseData = await response.json()
        if (response.ok) {
            const { data } = responseData
            var doctorsOptions = []
            var select = document.getElementById('patients')
            for (var i = 0; i < data.patients.length; i++) {
                var opt = document.createElement('option')
                opt.value = `option${i}`
                opt.textContent = `${data.patients[i][0].email}`
                select.appendChild(opt)
            }
        }
    } catch (err) {
        console.log(err)
    }
}

async function sendMessage(email, data) {
    try {
        data = {
            receiverEmail: email,
            data: data,
            _userType: "DOCTOR"
        }
        const response = await fetch("http://localhost:4000/api/sendMessage", {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        const responseMsg = await response.json()
        if (response.ok) {
            alert(responseMsg.msg)
        }
    } catch (err) {
        console.log(err)
    }
}



let editDocAndAppointBtn = document.getElementById(" doctorEdit")
if (editDocAndAppointBtn) {
    editDocAndAppointBtn.addEventListener('click', (event) => {
        event.preventDefault()
        try {
            fetch("http://localhost:4000/editDoctor")
                .then(() => window.location.href = '/editDoctor')
        } catch (err) {
            console.log(err)
        }
    })
} else {
    console.log("no btn")
}
let AppointBtn = document.getElementById("appoint")

if (AppointBtn) {
    AppointBtn.addEventListener('click', (event) => {
        event.preventDefault()
        try {
            fetch("http://localhost:4000/editDoctor")
                .then(() => window.location.href = '/editDoctor')
        } catch (err) {
            console.log(err)
        }
    })
} else {
    console.log("no btn")
}


const editPasswordBtn = document.getElementById("DoctorChangePassword")
if (editPasswordBtn) {
    editPasswordBtn.addEventListener('click', (event) => {
        try {
            event.preventDefault();
            fetch("http://localhost:4000/doctorChangePassword")
                .then(() => (window.location.href = "/doctorChangePassword")
                );
        } catch (err) {
            console.log(err);
        }
    })
}



const sendButton = document.getElementById("sendMessage")
if (sendButton) {
    sendButton.addEventListener('click', (event) => {
        try {
            event.preventDefault()
            var select = document.getElementById('patients')
            var message = document.getElementById("patientMessage").value
            var selectedEmail = select.options[select.selectedIndex].text
            if (selectedEmail === "Select your patient") {
                alert("please choose the patient email")
            } else {
                if (message) {
                    sendMessage(selectedEmail, message)
                } else {
                    alert("please enter the message you want to send")
                }
            }
        } catch (err) {
            console.log(err)
        }
    })
}

let patientIDs = []

async function displayAppointments() {
    try {
        const response = await fetch('http://localhost:4000/api/getallreservedappoints',
            {
                method: 'GET',
                credentials: 'include'
            })
        const responseData = await response.json()
        if (response.ok) {
            const appointRow = document.getElementById('appointRow')
            const appointmentCols = document.getElementById('appointCOL')
            const detailsButton = document.getElementById('detailsButton')
            for (var i = 0; i < responseData.data.length; i++) {
                if (i == 0) {
                    const appointmentNumber = document.getElementById('appnumber')
                    appointmentNumber.textContent = "Appointment 1"
                    const dateHeader = document.getElementById('dateHeader')
                    dateHeader.textContent = responseData.data[0].date
                    const timeHeader = document.getElementById('timeHeader')
                    let time = responseData.data[0].time
                    time = time.split('.')[0]
                    timeHeader.textContent = time
                    detailsButton.style.display = 'inline'
                    patientIDs.push(responseData.data[0].pid)
                    continue
                }
                patientIDs.push(responseData.data[i].pid)
                const newRow = appointRow.cloneNode(true)
                appointmentCols.appendChild(newRow)

            }
            const appnumbers = document.querySelectorAll('.appnumbers')
            const dateHeads = document.querySelectorAll('.dateHead')
            const timeHeads = document.querySelectorAll('.timeHead')

            const detailButtons = document.querySelectorAll('.detailsButtons')
            for (let k = 0; k < detailButtons.length; k++) {
                detailButtons[k].addEventListener('click', (event) => {
                    event.preventDefault()
                    appointmentDetails(k)
                })
            }

            for (let j = 1; j < responseData.data.length; j++) {
                appnumbers[j].textContent = `Appointment ${j + 1}`
                let time = responseData.data[j].time
                time = time.split('.')[0]
                dateHeads[j].textContent = responseData.data[j].date
                timeHeads[j].textContent = time
            }
        }
        else {
            const dateHeader = document.getElementById('dateHeader')
            dateHeader.textContent = "NO APPOINTMENTS RESERVED"
        }
    }
    catch (err) {
        console.log(err);
    }
}

async function DropDownListPatients() {
    let patientsDropDown = document.getElementById("patientRecord");
    const response = await fetch('http://localhost:4000/api/getDoctorPatient', {
        method: 'GET',
        credentials: 'include'
    })
    const responseData = await response.json()
    if (response.ok) {
        for (let i = 0; i < responseData.data.patients.length; i++) {
            let email = responseData.data.patients[i].email
            let first_name = responseData.data.patients[i].first_name
            let last_name = responseData.data.patients[i].last_name
            let option = document.createElement('option')
            option.text = `${first_name} ${last_name} (${email})`
            option.value = email
            patientsDropDown.add(option)
        }
    }
}


async function makeUploadReport() {
    const uploadButton = document.getElementById("uploadForm");
    // const fileUpload = document.getElementById('chooseFileRecord')
    // let scanURL = 0
    // fileUpload.addEventListener('change' , (event)=>{
    //     const scan = event.target.files[0]
    //     if (scan){
    //         scanURL = URL.createObjectURL(scan);
    //         let scanExtention = getFileExtension(scan.name)
    //         scanURL = scanURL.slice(5)
    //         scanURL = scanURL + `.${scanExtention}`
    //     }
    // })
    uploadButton.addEventListener('submit', async (event) => {
        event.preventDefault()
        let patientsDropDown = document.getElementById("patientRecord");
        const selectedPatientEmail = patientsDropDown.value
        const prescriptionTextField = document.getElementById('doctor_notes')
        const prescriptionContent = prescriptionTextField.value
        const scanInput = document.getElementById('chooseFileRecord')
        let scan = scanInput.files[0]
        if(selectedPatientEmail == ' '){
            alert('Please Select a Patient')
            return
        }
        let form = new FormData()
        form.append('pemail', selectedPatientEmail)
        form.append('prescriptionContent', prescriptionContent)
        if (scan) {
            form.append('scan', scan)
        }
        const response = await fetch('http://localhost:4000/api/makereport', {
            method: 'POST',
            credentials: 'include',
            body: form
        })
        let responseData = await response.json()
        alert(responseData.msg);
        fetch("http://localhost:4000/doctorProfile")
                .then(() => window.location.href = '/doctorProfile')
    })
}


async function getHealthStatusOnPatientSelect() {
    let bloodPressure = document.getElementById('editBloodPressure')
    let bloodGlucose = document.getElementById('editBloodGlucose')
    let bloodType = document.getElementById('editBloodType')
    let patientsDropDown = document.getElementById("patientRecord");
    patientsDropDown.addEventListener('change', async (event) => {
        event.preventDefault()
        let pateintEmail = patientsDropDown.value
        try {
            const response = await fetch(`http://localhost:4000/api/getHealthStatus?pemail=${encodeURIComponent(pateintEmail)}`)
            let responseData = await response.json()
            if (response.ok) {
                bloodPressure.value = responseData.data[0].blood_pressure_
                bloodGlucose.value = responseData.data[0].blood_sugar_level
            }
            else {
                alert(responseData.msg)
            }
        }
        catch (err) {
            console.log(err);
        }
    })
}

async function editPatientInfo() {
    const editPatientInfoButton = document.getElementById('editPatientInfo')
    editPatientInfoButton.addEventListener('click', async (event) => {
        event.preventDefault()
        let patientsDropDown = document.getElementById("patientRecord");
        const selectedPatientEmail = patientsDropDown.value
        if(selectedPatientEmail == ' '){
            alert('Please Select a Patient')
            return
        }
        const bloodPressure = document.getElementById('editBloodPressure')
        const bloodGlucose = document.getElementById('editBloodGlucose')
        const bloodType = document.getElementById('editBloodType')
        if (bloodPressure.value == '' && bloodGlucose.value == '' && bloodType.value.length <= 3 ){
            alert('You did not edit any information')
            return
        }
        let newPatientInfo
        if (bloodType.value.length <= 3) {
            newPatientInfo = {
                patientEmail: selectedPatientEmail,
                blood_sugar_level_: Number(bloodGlucose.value),
                blood_pressure: bloodPressure.value,
                blood_type: bloodType.value
            }
        }
        else {
            newPatientInfo = {
                patientEmail: selectedPatientEmail,
                blood_sugar_level_: Number(bloodGlucose.value),
                blood_pressure: bloodPressure.value,
            }
        }
        const response = await fetch('http://localhost:4000/api/editHealthStatus', {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newPatientInfo)
        })
        const responseData = await response.json()
        alert(responseData.msg)
    })
}

async function appointmentDetails(k) {
    let appointmentPatientID = patientIDs[k]
    const response = await fetch(`http://localhost:4000/api/getPatientwithID?pid=${encodeURIComponent(appointmentPatientID)}`)
    let responseData = await response.json()
    let email = document.getElementById("DoctorEmail")
    let doctorEmail = email.innerText
    localStorage.setItem('demail', doctorEmail)
    let doctorName = document.getElementById("doctorName").innerText
    localStorage.setItem('doctorName', doctorName)
    let responseDatastring = JSON.stringify(responseData)
    localStorage.setItem('patientDetails', responseDatastring)
    try {
        fetch("http://localhost:4000/appointmentDetails")
            .then(() => window.location.href = '/appointmentDetails')
    } catch (err) {
        console.log(err)
    }
}

function getFileExtension(filename) {
    return filename.split('.').pop().toLowerCase();
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
logout();
getHomePage()
getAndDisplayMessages()
getDocProfile()
FillSelectPatients()
displayAppointments()
DropDownListPatients()
getHealthStatusOnPatientSelect()
makeUploadReport()
editPatientInfo()
appointmentDetails()