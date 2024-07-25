let doctorEmail = localStorage.getItem('demail')
let patientDetailsstring = localStorage.getItem('patientDetails')
let patientDetails = JSON.parse(patientDetailsstring)
const patientName = document.getElementById("patientName");
const patientEmail = document.getElementById("patientEmail");
const patientAge = document.getElementById("age");
const patientGender = document.getElementById('gender')
const patientBloodType = document.getElementById('bloodType')
const patientPhone1 = document.getElementById('phoneNumber')
const patientPhone2 = document.getElementById('phoneNumber2')
const patientHealthInsurance = document.getElementById('insurance')
const patientImage = document.getElementById('patient-image')
const patientPressure = document.getElementById('bloodPressureValue')
const patientGlucose = document.getElementById('bloodGlucoseValue')

async function onloading() {
    patientName.innerText = `${patientDetails.data.patients.first_name} ${patientDetails.data.patients.last_name}`;
    patientEmail.innerText = `${patientDetails.data.patients.email} `;
    patientAge.innerText = `${patientDetails.data.patients.age} `;
    patientGender.innerText = `${patientDetails.data.patients.gender}`
    patientBloodType.innerText = `${patientDetails.data.patients.blood_type}`
    patientHealthInsurance.innerText = `${patientDetails.data.patients.health_insurance}`
    patientPhone1.innerText = `${patientDetails.data.phone_numbers[0].phone_numbers}`
    if (patientDetails.data.phone_numbers.length > 1) {
        const num1 = document.getElementById("phoneNumber");
        const num2 = document.getElementById("phoneNumber2");
        num1.innerText = `${patientDetails.data.phone_numbers[0].phone_numbers}`;
        num2.innerText = `${patientDetails.data.phone_numbers[1].phone_numbers}`;
    } else if (patientDetails.data.phone_numbers.length === 1) {
        const num1 = document.getElementById("phoneNumber");
        const num2 = document.getElementById("phoneNumber2");
        num1.innerText = `${patientDetails.data.phone_numbers[0].phone_numbers}`;
        num2.innerText = ` `;
    } else {
        const num1 = document.getElementById("phoneNumber");
        const num2 = document.getElementById("phoneNumber2");
        num1.innerText = `no phones`;
        num2.innerText = ` `;
    }
    patientImage.src = `${patientDetails.data.patients.photo}`
    patientPressure.innerText = `${patientDetails.data.patients.blood_pressure_}`
    patientPressure.innerText = `${patientDetails.data.patients.blood_pressure_}`
    patientGlucose.innerText = `${patientDetails.data.patients.blood_sugar_level}`

    const response = await fetch(`http://localhost:4000/api/getReportsforAppoint?pemail=${encodeURIComponent(patientDetails.data.patients.email)}`)
    const responseData = await response.json()
    let notes = document.getElementById("doctorNotes");
    let reportDate = document.getElementById("recordDate");
    let reportBlock = document.getElementById("fileBlock");
    let reportCOL = document.getElementById("reportsCOL");
    let reportLink = document.getElementById("fileRecordLink");
    let dateBox = document.getElementById("recordDate");
    if (responseData.msg === "No reports found") {
        notes.innerText = ' '
        reportDate.innerText = ' '
        reportLink.innerText = 'No Records Found'
        reportLink.href = ' '
        dateBox.style.display = 'none'
        return
    }
    if (response.ok) {
        for (let i = 0; i < responseData.data.reports.length; i++) {
            if (i == 0) {
                notes.innerText = `Doctor Notes : ${responseData.data.reports[0].prescription}`;
                reportDate.innerText = responseData.data.reports[0].report_date;
                if (responseData.data.reports[0].scanURL) {
                    reportLink.href = responseData.data.reports[0].scanURL;
                }
                continue
            }
            let newReportBlock = reportBlock.cloneNode(true);
            reportCOL.appendChild(newReportBlock);
        }
        const allReportNotes = document.querySelectorAll(".doctorNotes");
        const allReportDates = document.querySelectorAll(".recordDate");
        const allReportURLS = document.querySelectorAll(".fileRecordLink");

        for (let j = 1; j < responseData.data.reports.length; j++) {
            allReportNotes[j].innerText = `Doctor Notes : ${responseData.data.reports[j].prescription}`;
            allReportDates[j].innerText = responseData.data.reports[j].report_date;
            console.log(responseData.data.reports[j].scanURL);
            if (responseData.data.reports[j].scanURL) {
                allReportURLS[j].href = responseData.data.reports[j].scanURL;
            }
            else{
                allReportURLS[j].href = ''
            }
        }
    }
    else {
        alert(responseData.msg)
    }
}

const receiptButton = document.getElementById('receitButton')
receiptButton.addEventListener('click', (event) => {
    event.preventDefault()
    const patientName = document.getElementById("patientName");
    const patientHealthInsurance = document.getElementById("insurance");
    localStorage.setItem("pName", patientName.innerText)
    localStorage.setItem("pEmail", patientEmail.innerText)
    localStorage.setItem("pinsurance", patientHealthInsurance.innerText)
    try {
        fetch("http://localhost:4000/makeReceipt")
            .then(() => window.location.href = '/makeReceipt')
    }
    catch (error) {
        console.log(error);
    }
})

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
const profile_button = document.getElementById("doctorprofile")
if(profile_button){
profile_button.addEventListener('click', (event) => {
    event.preventDefault()
    fetch("http://localhost:4000/doctorProfile")
        .then(() => {
            window.location.href = '/doctorProfile'
        })
})
}
getHomePage()

logout();

onloading()