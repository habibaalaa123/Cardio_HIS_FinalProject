const fName = document.getElementById('AdminEditFname')
const lName = document.getElementById('AdminEditLname')
const phone = document.getElementById('AdminEditPhone')
const age = document.getElementById('AdminEditAge')
const position = document.getElementById('AdminEditPosition')
const image = document.getElementById('edit-profile-image')
const doc_email = localStorage.getItem('doc_email')
async function onloading() {
    const response = await fetch(`http://localhost:4000/api/getCurrentDoctorFromAdmin?demail='${encodeURIComponent(doc_email)}'`,
        {
            method: 'GET',
            credentials: 'include'
        })
    const responseData = await response.json()
    if (response.ok) {
        fName.value = responseData.data.doctors.first_name
        lName.value = responseData.data.doctors.last_name
        phone.value = responseData.data.phone_numbers[0].phone_numbers
        age.value = responseData.data.doctors.age
        position.value = responseData.data.doctors.position
        image.src = responseData.data.doctors.photo
    }



}



const back_button = document.getElementById("back")
back_button.addEventListener('click', (event) => {
    event.preventDefault()
    fetch("http://localhost:4000/adminProfile")
        .then(() => {
            window.location.href = '/adminProfile'
        })
})

async function editDoctor() {
    try {
        const save_button = document.getElementById("done")
        if (save_button) {
            save_button.addEventListener("click", async (event) => {
                event.preventDefault();
                
                const response = await fetch("http://localhost:4000/api/editAdminDoctor", {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data = {
                        first_name: fName.value,
                        last_name: lName.value,
                        age: age.value,
                        phone_number: phone.value,
                        position: position.value,
                        DoctorEmail : doc_email,
                        photo: image.src
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
                    const imageContainer = document.getElementById('edit-profile-image');
                    imageContainer.src = imageUrl; // Display the uploaded image
                })

        })
    }
    catch (error) {
        console.error('Error fetching data:', error);
    }
}

const profile_button = document.getElementById("profile")
if(profile_button){
profile_button.addEventListener('click', (event) => {
    event.preventDefault()
    fetch("http://localhost:4000/adminProfile")
        .then(() => {
            window.location.href = '/adminProfile'
        })
})
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

async function logout(){
    const logoutBtn =document.getElementById("logoutLink")
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
onloading()
editDoctor()