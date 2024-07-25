async function patientProfile() {
  try {
    const response = await fetch("http://localhost:4000/api/getPatient", {
      method: "GET",
      credentials: "include",
    });
    const infoResponse = await fetch(
      "http://localhost:4000/api/getAppointmentsInfoPatient",
      {
        metod: "GET",
        credentials: "include",
      }
    );
    const infoResponseData = await infoResponse.json();
    console.log(infoResponseData);
    const responseData = await response.json();
    if (response.ok) {
      const { data } = responseData;
      const patientName = document.getElementById("patientName");
      patientName.innerText = `${data.patients.first_name} ${data.patients.last_name}`;

      const patientEmail = document.getElementById("patientEmail");
      patientEmail.innerText = `${data.patients.email} `;

      const patientAge = document.getElementById("age");
      patientAge.innerText = `${data.patients.age} `;

      const post = document.getElementById("patientpostApp");
      post.innerText = `${infoResponseData.data.post}`;
      // console.log("post", post)

      const upcoming = document.getElementById("patientComingApp");
      upcoming.innerText = `${infoResponseData.data.upcoming}`;
      // console.log("upcoming", upcoming)

      const patientGender = document.getElementById("gender")
      patientGender.innerText = `${data.patients.gender}`

      const patientHealthInsurance = document.getElementById("insurance");
      patientHealthInsurance.innerText = `${data.patients.health_insurance}`;

      const patientBloodPressure = document.getElementById("bloodPressure");
      patientBloodPressure.innerText = `${data.patients.blood_pressure_}`;

      const patientBloodType = document.getElementById("bloodType");
      patientBloodType.innerText = `${data.patients.blood_type}`;

      const patientBloodGlucose = document.getElementById("bloodGlucose");
      patientBloodGlucose.innerText = `${data.patients.blood_sugar_level}`;

      const patientImage = document.getElementById('patient-image')
      if (data.patients.photo)
        patientImage.src = `${data.patients.photo}`
      else {
        profileImage.src = "Photos/profile-icon.png"
      }

      if (data.phone_numbers.length > 1) {
        const num1 = document.getElementById("phoneNumber");
        const num2 = document.getElementById("phoneNumber2");
        num1.innerText = `${data.phone_numbers[0].phone_numbers}`;
        num2.innerText = `${data.phone_numbers[1].phone_numbers}`;
      } else if (data.phone_numbers.length === 1) {
        const num1 = document.getElementById("phoneNumber");
        const num2 = document.getElementById("phoneNumber2");
        num1.innerText = `${data.phone_numbers[0].phone_numbers}`;
        num2.innerText = ` `;
      } else {
        const num1 = document.getElementById("phoneNumber");
        const num2 = document.getElementById("phoneNumber2");
        num1.innerText = `no phones`;
        num2.innerText = ` `;
      }
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

async function getAndDisplayMessages() {
  try {
    const response = await fetch("http://localhost:4000/api/getMessages", {
      method: "GET",
      credentials: "include",
    });
    const responseData = await response.json();
    const messagesDiv = document.getElementById("messages");
    if (responseData.msg === "No messages found") {
      messagesDiv.innerHTML = `<p style=" font-weight:600 ; font-size : 17px ; text-align:center; color: var(--text-blue);"> No messages yet</p>`
    }
    if (response.ok) {
      const { data } = responseData;
      if (data.messages.length > 0) {
        console.log("there")
        for (let i = data.messages.length - 1; i >= 0; i--) {
          var senderParagraphTest = document.createElement("div");
          const dateText = `${data.messages[i].date}`.slice(0, 10);
          const dateTime = `${data.messages[i].time}`.slice(0, 5);
          senderParagraphTest.innerHTML = `<div class="calendar-item" style="background-color: var(--text-div-background); border:2px solid var(--text-purple); border-radius: 15px">
                <p style="color: var(--text-blue);" >message from : ${data.messages[i].sender} <br> date : ${dateText} <br> time : ${dateTime} <br> "${data.messages[i].content}" </p>
                <p style ="color: var(--text-blue);"></p>
            </div>`;
          messagesDiv.appendChild(senderParagraphTest);
        }

      }
    }
  }
  catch (err) {
    console.log(err);
  }
}

async function FillSelectDoctor() {
  try {
    const response = await fetch("http://localhost:4000/api/getDoctors", {
      method: "GET",
      credentials: "include",
    });
    const responseData = await response.json();
    if (response.ok) {
      const { data } = responseData;
      var select = document.getElementById("doctors");
      for (var i = 0; i < data.doctors.length; i++) {
        var opt = document.createElement("option");
        opt.value = `option${i}`;
        opt.textContent = `${data.doctors[i][0].email}`;
        select.appendChild(opt);
      }
    }
  } catch (err) {
    console.log(err);
  }
}

async function sendMessage(email, data) {
  try {
    data = {
      receiverEmail: email,
      data: data,
      _userType: "PATIENT",
    };
    const response = await fetch("http://localhost:4000/api/sendMessage", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const responseMsg = await response.json();
    if (response.ok) {
      alert(responseMsg.msg);
    }
  } catch (err) {
    console.log(err);
  }
}

const sendButton = document.getElementById("sendMessage");
if (sendButton) {
  sendButton.addEventListener("click", (event) => {
    try {
      event.preventDefault();
      var select = document.getElementById("doctors");
      var message = document.getElementById("patientMessage").value;
      var selectedEmail = select.options[select.selectedIndex].text;
      if (selectedEmail === "Select a doctor") {
        alert("please chose the doctor email");
      } else {
        if (message) {
          sendMessage(selectedEmail, message);
        } else {
          alert("please enter the message you want to send");
        }
      }
    } catch (err) {
      console.log(err);
    }
  });
}

function toMakeAppointment() {
  const addAppointment = document.getElementById("addAppointment");
  addAppointment.addEventListener("click", (event) => {
    try {
      event.preventDefault();
      fetch("http://localhost:4000/makeAppointment").then(
        () => (window.location.href = "/makeAppointment")
      );
    } catch (err) {
      console.log(err);
    }
  });
}

async function showAppointments() {
  try {
    const response = await fetch("http://localhost:4000/api/getAppointments", {
      method: "GET",
      credentials: "include",
    });
    const responseData = await response.json();
    if (responseData.msg === "No appointments found") {
      const parentElement = document.getElementById("appointmentsCol")
      const element = document.createElement('div')
      element.innerHTML = `<div class="col-lg-12" id="AppointmentDoctor">
                                    <div class="calendar-item "
                                        style="background-color: var(--text-div-background); display: block;text-align: left;">
                                        <h3 style="color: var(--text-blue); " class="appnumber" id='AppointmentDoctorName'>
                                            No reserved appointments </h3>
                                        
                                    </div>
                                </div>`
      parentElement.append(element)
    }
    if (response.ok) {
      if (responseData.data.appointments.length) {
        const parentElement = document.getElementById("appointmentsCol")

        for (let i = 0; i < responseData.data.appointments.length; i++) {
          const newDiv = document.createElement("div");
          newDiv.className = "row";
          newDiv.innerHTML = `<div class="col-lg-1">
                                    <div class="calendar-item " style="background-color: var(--text-div-background); align-items: center;">
                                        <img src="Photos/appointmentIcon.png"
                                            style="margin-top: -22px; margin-right: -70px;">
                                    </div>
                                </div>
    
                                <div class="col-lg-2" id="AppointmentDoctor">
                                    <div class="calendar-item "
                                        style="background-color: var(--text-div-background); display: block;text-align: left;">
                                        <h3 style="color: var(--text-blue); " class="appnumber" id='AppointmentDoctorName'>
                                            Dr ${responseData.data.appointments[i].first_name} ${responseData.data.appointments[i].last_name} </h3>
                                        <p style="color: var(--text-purple);" id='AppointmentDoctorPosition'>Surgeon</p>
                                    </div>
                                </div>
                                <div class="col-lg-2" id="appointment">
                                    <div class="calendar-item "
                                        style="background-color: var(--text-div-background); display: block;text-align: left;">
                                        <h3 style="color: var(--text-blue);">Appointment</h3>
                                        <p style="color: var(--text-purple);" class="appnumber" id='appnumber'>Appointment ${responseData.data.appointments.length - (i + 1) + 1} </p>
                                    </div>
                                </div>
                                <div class="col-lg-2" id="day">
                                    <div class="calendar-item "
                                        style="background-color: var(--text-div-background); display: block;text-align: left;">
                                        <h3 style="color: var(--text-blue); ">Day</h3>
                                        <p style="color: var(--text-purple); " class="dateHead" id='dateHeader'>${responseData.data.appointments[i].date}</p>
                                    </div>
                                </div>
                                <div class="col-lg-2" id="time">
                                    <div class="calendar-item "
                                        style="background-color: var(--text-div-background); display: block;text-align: left;">
                                        <h3 style="color: var(--text-blue);">Time</h3>
                                        <p style="color: var(--text-purple);" class="timeHead" id='timeHeader'>${responseData.data.appointments[i].time.slice(0, 5)}</p>
                                    </div>
                                </div>
                                <div class="col-lg-1" id="time">
                                    <div class="calendar-item "
                                        style="background-color: var(--text-div-background); display: block;text-align: left;">
                                        <button id="deleteAppointment${responseData.data.appointments.length - (i + 1) + 1}" class="pinkSmBtn"
                                        style="display: inline; margin-left:10px; margin-right: 10px;">delete appointment</button>
                                    </div>
                                </div>`
            ;
          parentElement.appendChild(newDiv)
          let deleteBtn = document.getElementById(`deleteAppointment${responseData.data.appointments.length - (i + 1) + 1}`)
          if (deleteBtn) {
            deleteBtn.addEventListener('click', async (event) => {
              event.preventDefault()
              console.log(responseData.data.appointments[i].appid)
              deleteAppointment(responseData.data.appointments[i].appid)

            })
          }
        }

      }
      else if (!responseData.data.availappoint.length) {
        console.log(4)
        const parentElement = document.getElementById("appointmentsCol")
        const element = document.createElement('div')
        element.innerHTML = `<div class="col-lg-12" id="AppointmentDoctor">
                                    <div class="calendar-item "
                                        style="background-color: var(--text-div-background); display: block;text-align: left;">
                                        <h3 style="color: var(--text-blue); " class="appnumber" id='AppointmentDoctorName'>
                                            no avalable appointments </h3>
                                        <p style="color: var(--text-purple);" id='AppointmentDoctorPosition'>Surgeon</p>
                                    </div>
                                </div>`
        parentElement.append(element)
      }
    }
    // else {
    //   const dateHeader = document.getElementById("dateHeader");
    //   dateHeader.textContent = "NO APPOINTMENTS RESERVED";
    // }
  } catch (err) {
    console.log(err);
  }
}

async function deleteAppointment(appointmentId) {
  try {
    data = {
      appointment_id: appointmentId
    }
    const response = await fetch("http://localhost:4000/api/deleteAppointment", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    const responseMsg = await response.json()
    alert(responseMsg.msg)
    fetch("http://localhost:4000/patientProfile").then(
      () => (window.location.href = "/patientProfile")
    );
  } catch (err) {
    console.log(err)
  }
}
const editButton = document.getElementById("editPatient");
if (editButton) {
  editButton.addEventListener("click", (event) => {
    try {
      event.preventDefault();
      fetch("http://localhost:4000/editPatient").then(
        () => (window.location.href = "/editPatient")
      );
    } catch (err) {
      console.log(err);
    }
  });
} else {
  console.log("cannot get the button");
}

const editPasswordBtn = document.getElementById("PatientChangePassword")
if (editPasswordBtn) {
  editPasswordBtn.addEventListener('click', (event) => {
    try {
      event.preventDefault();
      fetch("http://localhost:4000/patientChangePassword")
        .then(() => (window.location.href = "/patientChangePassword")
        );
    } catch (err) {
      console.log(err);
    }
  })
}
async function showReports() {
  const response = await fetch("http://localhost:4000/api/getReports", {
    method: "GET",
    credentials: "include",
  });
  const responseData = await response.json();
  let notes = document.getElementById("doctorNotes");
  let reportDate = document.getElementById("recordDate");
  let reportBlock = document.getElementById("fileBlock");
  let reportCOL = document.getElementById("reportsCOL");
  let reportLink = document.getElementById("fileRecordLink");
  let dateBox = document.getElementById("dateBox");
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
      allReportNotes[
        j
      ].innerText = `Doctor Notes : ${responseData.data.reports[j].prescription}`;
      allReportDates[j].innerText = responseData.data.reports[j].report_date;
      if (responseData.data.reports[j].scanURL) {
        allReportURLS[j].href = responseData.data.reports[j].scanURL;
      }
      else{
        allReportURLS[j].href = ''
      }
    }
  }

}
async function logout() {
  const logoutBtn = document.getElementById("logout")
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async (event) => {
      event.preventDefault()

      const response = await fetch('http://localhost:4000/api/logout', {
        method: 'GET',
        credentials: 'include',
      })
      const result = await response.json()
      console.log(result.msg)
      if (response.ok) {

        fetch("http://localhost:4000/login")
          .then(() => window.location.href = '/login')
      }
    })
  }
}

async function getHomePage() {
  const hmBtn = document.getElementById("home")
  if (hmBtn)
    hmBtn.addEventListener('click', async (event) => {
      event.preventDefault()

      const response = await fetch('http://localhost:4000/api/logout', {
        method: 'GET',
        credentials: 'include',
      })
      const result = await response.json()
      console.log(result.msg)
      if (response.ok) {
        fetch("http://localhost:4000/homePage")
          .then(() => window.location.href = '/homePage')
      }
    })
}

async function getMakeAppointment() {
  const appoint = document.getElementById("appoint")
  if (appoint) {
    appoint.addEventListener('click', async (event) => {
      event.preventDefault();
      fetch("http://localhost:4000/makeAppointment")
        .then(() => window.location.href = '/makeAppointment')
    }
    )
  }

}

getMakeAppointment();
getHomePage();
logout();
getAndDisplayMessages();
patientProfile();
FillSelectDoctor();
toMakeAppointment();
showAppointments();
showReports();
