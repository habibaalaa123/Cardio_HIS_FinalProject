async function FillSelectDoctor() {
    try {
        const response = await fetch("http://localhost:4000/api/getDoctors", {
            method: 'GET',
            credentials: 'include',
        })
        const responseData = await response.json()
        if (response.ok) {
            const { data } = responseData
            var select = document.getElementById('doctorsEdit')
            for (var i = 0; i < data.doctors.length; i++) {
                var opt = document.createElement('option')
                opt.value = `${data.doctors[i][0].email}`
                opt.textContent = `${data.doctors[i][0].first_name} ${data.doctors[i][0].last_name} (${data.doctors[i][0].email})`
                select.appendChild(opt)
            }
        }
    } catch (err) {
        console.log(err)
    }
}

async function searchAppointments() {
    let SelectedDoctorEmail
    const selectedDoctor = document.getElementById("doctorsEdit")
    const searchAppointforSelectedDoctor = document.getElementById("searchAppointment")
    searchAppointforSelectedDoctor.addEventListener('click', async (event) => {
        event.preventDefault()
        let reserveButtons = []
        SelectedDoctorEmail = selectedDoctor.options[selectedDoctor.selectedIndex].value
        console.log(SelectedDoctorEmail);
        try {
            const response = await fetch(`http://localhost:4000/api/getallappoints?demail=${SelectedDoctorEmail}`, {
                method: 'GET',
                credentials: 'include',
            })
            const responseData = await response.json()
            const appointmentTable = document.getElementById("appointmentsTable")

            while (appointmentTable.rows.length > 0) {
                appointmentTable.deleteRow(0);
            }

            if (responseData.status == 'fail') {
                alert("No appointments are available for the selected doctor")
            }

            if (response.ok) {
                appointmentTable.style.width = '100%';  // Set table width to 100%
                appointmentTable.style.borderCollapse = 'collapse';  // Collapse borders between cells
                appointmentTable.style.backgroundColor = '#f2f2f2';  // Set background color
                appointmentTable.style.fontFamily = 'Arial, sans-serif';  // Set font family
                appointmentTable.style.fontSize = '14px';  // Set font size

                appointmentsLength = responseData.data.length

                for (let i = 0; i < appointmentsLength; i++) {
                    if (i == 0) {
                        const header = appointmentTable.insertRow()
                        const Dateheader = header.insertCell()
                        Dateheader.style.border = '1px solid #ddd';  // Border around data cells
                        Dateheader.style.padding = '4px';  // Padding inside data cells
                        Dateheader.style.textAlign = 'center';
                        Dateheader.textContent = "DATE"
                        const Timeheader = header.insertCell()
                        Timeheader.style.border = '1px solid #ddd';  // Border around data cells
                        Timeheader.style.padding = '4px';  // Padding inside data cells
                        Timeheader.style.textAlign = 'center';
                        Timeheader.textContent = "TIME"
                        const buttonHeader = header.insertCell()
                        buttonHeader.style.border = '1px solid #ddd';  // Border around data cells
                        buttonHeader.style.padding = '4px';  // Padding inside data cells
                        buttonHeader.style.textAlign = 'center';

                    }
                    const row = appointmentTable.insertRow()
                    for (let j = 0; j < 3; j++) {
                        const cell = row.insertCell()
                        cell.style.border = '1px solid #ddd';  // Border around data cells
                        cell.style.padding = '8px';  // Padding inside data cells
                        cell.style.textAlign = 'center';
                        let date = responseData.data[i].date.substring(0, 10)
                        let time = responseData.data[i].time
                        switch (j) {
                            case 0:
                                {
                                    cell.textContent = date
                                    break
                                }
                            case 1:
                                {
                                    cell.textContent = time
                                    break
                                }
                            case 2:
                                {
                                    const reserveButton = document.createElement('button')
                                    reserveButton.className = "editDoctorBtn"
                                    reserveButton.textContent = "Reserve"
                                    reserveButtons.push(reserveButton)
                                    cell.appendChild(reserveButton)
                                }
                        }
                    }
                }
                for (let k = 0; k < reserveButtons.length; k++) {
                    reserveButtons[k].addEventListener('click', async (event) => {
                        event.preventDefault()
                        const reservationDetails = {
                            date: appointmentTable.rows[k + 1].cells[0].textContent,
                            time: appointmentTable.rows[k + 1].cells[1].textContent,
                            demail: SelectedDoctorEmail
                        }
                        const response = await fetch(`http://localhost:4000/api/makeappoint`, {
                            method: 'POST',
                            credentials: 'include',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(reservationDetails)
                        })
                        const responseAnswer = await response.json()
                        console.log(responseAnswer);
                        if (response.ok) {
                            alert(`Reserved Successfully at date : ${appointmentTable.rows[k + 1].cells[0].textContent} and time ${appointmentTable.rows[k + 1].cells[1].textContent}`)
                            fetch("http://localhost:4000/patientProfile")
                                .then(() => window.location.href = '/patientProfile')
                        }
                        else {
                            alert(responseAnswer.msg)
                        }
                    })
}
            }
        }
        catch (err) {
    console.log(err);
}
    })
}

const hmBtn = document.getElementById("home")
if(hmBtn){
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

const profile_button = document.getElementById("profile")
if(profile_button){
profile_button.addEventListener('click', (event) => {
    event.preventDefault()
    fetch("http://localhost:4000/patientProfile")
        .then(() => {
            window.location.href = '/patientProfile'
        })
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
FillSelectDoctor()
searchAppointments()