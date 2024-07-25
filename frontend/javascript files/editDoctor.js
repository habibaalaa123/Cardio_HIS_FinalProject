async function addAppointment() {
    const date = document.getElementById('appointmentDate')
    const time = document.getElementById('appointmentTime')
    const addAppointmentButton = document.getElementById('doctorAddAppointment')
    addAppointmentButton.addEventListener('click', async (event) => {
        const appointmentDetails = {
            date: date.value,
            time: time.value
        }
        event.preventDefault()
        const response = await fetch(`http://localhost:4000/api/addAppointment`, {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(appointmentDetails)
        })
        const responseAnswer = await response.json()
        if (response.ok) {
            alert(`Appointment with Date : ${date.value} and Time : ${time.value} was added successfully to your account`)
        }
        else {
            alert(responseAnswer.msg)
        }
    })
}

addAppointment()
async function editDoctor() {
    try {
        const save_button = document.getElementById("save")
        if (save_button) {
            console.log("saved")

            save_button.addEventListener("click", async (event) => {
                event.preventDefault();

                const fName = document.getElementById('editFname').value;
                const lName = document.getElementById('editLname').value;
                const phone = document.getElementById('editPhone').value;
                const age = document.getElementById('editAge').value;
                const imageURL = document.getElementById('profile-image').src

                const response = await fetch("http://localhost:4000/api/editDoctor", {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data = {
                        first_name: fName,
                        last_name: lName,
                        photo: imageURL,
                        age: age,
                        phone_number: phone

                    })
                })

                if (response.ok) {
                    console.log('Data Updated seccessfully');
                    alert('Data Updated seccessfully');
                }
                else {
                    console.error('Faild to update data');
                    alert('Faild to update data');
                }

            }
            )
        }
        const editPhotoButton = document.getElementById('editPhoto')
        editPhotoButton.addEventListener('click', (event) => {
            event.preventDefault()
            const fileInput = document.getElementById('fileInput');
            console.log(fileInput);
            const file = fileInput.files[0];

            const formData = new FormData();
            formData.append('profilePic', file);

            fetch('/profilePhoto', {
                method: 'POST',
                body: formData
            })
                .then(response => response.text())
                .then(imageUrl => {
                    const imageContainer = document.getElementById('profile-image');
                    imageContainer.src = imageUrl; // Display the uploaded image
                })

        })
    }
    catch (error) {
        console.error('Error fetching data:', error);
    }
}

async function onloading() {
    const fName = document.getElementById('editFname')
    const lName = document.getElementById('editLname')
    const phone = document.getElementById('editPhone')
    const age = document.getElementById('editAge')
    const image = document.getElementById('profile-image')

    const response = await fetch('http://localhost:4000/api/getCurrentDoctor',
        {
            method: 'GET',
            credentials: 'include'
        })
    const responseData = await response.json()
    console.log(responseData);
    if (response.ok) {
        console.log(responseData);
        fName.value = responseData.data.doctors.first_name
        lName.value = responseData.data.doctors.last_name
        phone.value = responseData.data.phone_numbers[0].phone_numbers
        age.value = responseData.data.doctors.age
        if(responseData.data.doctors.photo){
        image.src = responseData.data.doctors.photo
        }
    }
    else{
        alert(responseData.msg)
    }

}

onloading()
editDoctor();

const back_button = document.getElementById("back")
back_button.addEventListener('click', (event) => {
    event.preventDefault()
    fetch("http://localhost:4000/doctorProfile")
        .then(() => {
            window.location.href = '/doctorProfile'
        })
})
const profile_button = document.getElementById("profile")
if(profile_button){
profile_button.addEventListener('click', (event) => {
    event.preventDefault()
    fetch("http://localhost:4000/doctorProfile")
        .then(() => {
            window.location.href = '/doctorProfile'
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
