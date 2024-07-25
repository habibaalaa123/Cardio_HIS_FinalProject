const lognBtn = document.getElementById("login")
if (lognBtn) {
    lognBtn.addEventListener('click', (event) => {
        event.preventDefault()
        fetch("http://localhost:4000/login")
            .then(() => window.location.href = '/login')
    })
}


const appointments = document.getElementById("appointment")
if (appointments) {
    appointments.addEventListener('click', (event) => {
        event.preventDefault()
        fetch("http://localhost:4000/login")
            .then(() => window.location.href = '/login')
    })
}


async function displayDoc() {

    try {
        parentElement = document.getElementById("container")
        const response = await fetch('http://localhost:4000/api/getDoctors',
            {
                method: 'GET',
                credentials: 'include'
            })
        const responseData = await response.json()
        console.log(responseData)
        // const{data}=responseData.data
        for (var i = 0; i < responseData.data.doctors.length; i++) {
            var childElement = document.createElement("div");
            let photoURL = responseData.data.doctors[i][0].photo;

            
            
            childElement.innerHTML = `
                            
                            <div class="flip-card" style="margin-right: 20px;">
                                <div class="flip-card-inner">
                                <div class="flip-card-front">
                                    <img src= "${photoURL}" alt="Avatar" style="width:250px;height:300px;">
                                </div>
                                <div class="flip-card-back">
                                    <h3 style="font-weight: 700; margin-top: 30%; font-size:20px ; ">DR. <span id="doctorName">${responseData.data.doctors[i][0].first_name} ${responseData.data.doctors[i][0].last_name}</span></h3>
                                    <h3 style="font-size: 20px;" id="doctorPosition">${responseData.data.doctors[i][0].position}</h3>
                                    <h3 style="font-size: 20px;"><span id="doctorAge">${responseData.data.doctors[i][0].age}</span> years</h3>
                                    
                                </div>
                                </div>
                            </div>
                            
                    `

           parentElement.append(childElement)         
        }



    } catch (error) {
        console.log(error)
    }

}

displayDoc()



