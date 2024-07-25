const addMedicineButton = document.getElementById('addMedicine')
const addScanButton = document.getElementById('addScan')
const medicineSelected = document.getElementById('medicineType')
const scanSelected = document.getElementById('scanType')
let medicineTable = document.getElementById('medicinesTable')
let scanTable = document.getElementById('scansTable')
const tobePaid = document.getElementById('tobePaid')
const tobePaidFinal = document.getElementById('tobePaidFinal')
const finishButton = document.getElementById('finish')
const itemAdded = new Event('itemAdded')
const itemRemoved = new Event('itemRemoved')
let patientInsurance = localStorage.getItem('pinsurance')

let insurances = {
    Engineering_Insurance: 0.3,
    Teacher_Insurance: 0.3,
    Doctor_Insurance: 0.2,
    University_Professor_Insurance: 0.,
    No_Insurance: 1
}

let TotalCost = 0
let TotalCostAfterInsurance = 0
let scanTypes, medicineTypes

let medicineQuantities = {}
let medicineFirstTime = {}
let medicineTableIndices = {}

addMedicineButton.addEventListener('click', async (event) => {
    event.preventDefault()
    let medicineName = medicineSelected.value
    let medicineSelectedIndex = medicineSelected.selectedIndex - 1
    let deleteButton = document.createElement('button')
    let row
    let medicineCell
    let deleteCell


    if (medicineName && medicineFirstTime[medicineName]) {
        row = medicineTable.insertRow(-1)
        medicineCell = row.insertCell(0)
        let medicineCost = row.insertCell(1)
        let medicineQuantity = row.insertCell(2)
        deleteCell = row.insertCell(3)

        medicineCell.innerText = medicineName
        medicineCell.style.color = 'var(--text-black)'

        medicineCost.innerText = Number(medicineTypes.data[medicineSelectedIndex].cost)
        medicineCost.style.color = 'var(--text-black)'

        medicineQuantities[medicineName] += 1
        medicineQuantity.innerText = medicineQuantities[medicineName]
        medicineQuantity.style.color = 'var(--text-black)'

        medicineFirstTime[medicineName] = false
        medicineTableIndices[medicineName] = row.rowIndex
        TotalCost += Number(medicineCost.innerText)
        TotalCostAfterInsurance = TotalCost * Number(insurances[patientInsurance])

        deleteButton.innerText = 'Delete'
        deleteButton.className = 'pinkBtn'
        deleteCell.appendChild(deleteButton)
    }
    else if (medicineName && !medicineFirstTime[medicineName]) {
        medicineQuantities[medicineName] += 1
        let quantitycell = medicineTable.rows[medicineTableIndices[medicineName]].cells[2]
        quantitycell.innerText = medicineQuantities[medicineName]
        let costCell = medicineTable.rows[medicineTableIndices[medicineName]].cells[1]
        TotalCost += Number(costCell.innerText)
        TotalCostAfterInsurance = TotalCost * Number(insurances[patientInsurance])
    }
    deleteButton.addEventListener('click', () => {
        let quantitycell = medicineTable.rows[medicineTableIndices[medicineName]].cells[2]
        let costCell = medicineTable.rows[medicineTableIndices[medicineName]].cells[1]
        if (Number(quantitycell.innerText) > 1) {
            quantitycell.innerText = Number(quantitycell.innerText) - 1
            medicineQuantities[medicineName] = Number(quantitycell.innerText)
            TotalCost -= Number(costCell.innerText)
            TotalCostAfterInsurance = TotalCost * Number(insurances[patientInsurance])
            medicineTable.dispatchEvent(itemRemoved)
        }
        else {
            medicineTable.deleteRow(row.rowIndex)
            medicineFirstTime[medicineName] = true
            medicineQuantities[medicineName] = 0
            TotalCost -= Number(costCell.innerText)
            TotalCostAfterInsurance = TotalCost * Number(insurances[patientInsurance])
            medicineTable.dispatchEvent(itemRemoved)
            for (let j = 0; j < medicineTable.rows.length; j++) {
                let currentCell = medicineTable.rows[j].cells[0]
                let medicineName = currentCell.innerText
                medicineTableIndices[medicineName] = j
            }
        }
    })
    medicineTable.dispatchEvent(itemAdded)
}
)

medicineTable.addEventListener('itemAdded', (event) => {
    event.preventDefault()
    tobePaid.textContent = TotalCost
    tobePaidFinal.textContent = TotalCostAfterInsurance
})
medicineTable.addEventListener('itemRemoved', (event) => {
    event.preventDefault()
    tobePaid.textContent = TotalCost
    tobePaidFinal.textContent = TotalCostAfterInsurance
})

let scanQuantities = {}
let scanFirstTime = {}
let scanTableIndices = {}


addScanButton.addEventListener('click', async (event) => {
    event.preventDefault()
    let scanName = scanSelected.value
    let scanSelectedIndex = scanSelected.selectedIndex - 1
    let deleteButton = document.createElement('button')
    let row
    let scanCell
    let deleteCell

    if (scanName && scanFirstTime[scanName]) {
        row = scanTable.insertRow(-1)
        scanCell = row.insertCell(0)
        let scanCost = row.insertCell(1)
        let scanQuantity = row.insertCell(2)
        deleteCell = row.insertCell(3)

        scanCell.innerText = scanName
        scanCell.style.color = 'var(--text-black)'

        scanCost.innerText = Number(scanTypes.data[scanSelectedIndex].cost)
        scanCost.style.color = 'var(--text-black)'

        scanQuantities[scanName] += 1
        scanQuantity.innerText = scanQuantities[scanName]
        scanQuantity.style.color = 'var(--text-black)'

        scanFirstTime[scanName] = false
        scanTableIndices[scanName] = row.rowIndex

        TotalCost += Number(scanCost.innerText)
        TotalCostAfterInsurance = TotalCost * Number(insurances[patientInsurance])

        deleteButton.innerText = 'Delete'
        deleteButton.className = 'pinkBtn'

        deleteCell.appendChild(deleteButton)
    }
    else if (scanName && !scanFirstTime[scanName]) {
        scanQuantities[scanName] += 1
        let quantitycell = scanTable.rows[scanTableIndices[scanName]].cells[2]
        quantitycell.innerText = scanQuantities[scanName]
        let costCell = scanTable.rows[scanTableIndices[scanName]].cells[1]
        TotalCost += Number(costCell.innerText)
        TotalCostAfterInsurance = TotalCost * Number(insurances[patientInsurance])

    }
    deleteButton.addEventListener('click', () => {
        let quantitycell = scanTable.rows[scanTableIndices[scanName]].cells[2]
        let costCell = scanTable.rows[scanTableIndices[scanName]].cells[1]

        if (Number(quantitycell.innerText) > 1) {
            quantitycell.innerText = Number(quantitycell.innerText) - 1
            scanQuantities[scanName] = Number(quantitycell.innerText)
            TotalCost -= Number(costCell.innerText)
            TotalCostAfterInsurance = TotalCost * Number(insurances[patientInsurance])
            scanTable.dispatchEvent(itemRemoved)
        }
        else {
            scanTable.deleteRow(row.rowIndex)
            scanFirstTime[scanName] = true
            scanQuantities[scanName] = 0
            TotalCost -= Number(costCell.innerText)
            TotalCostAfterInsurance = TotalCost * Number(insurances[patientInsurance])
            scanTable.dispatchEvent(itemRemoved)
            for (let j = 0; j < scanTable.rows.length; j++) {
                let currentCell = scanTable.rows[j].cells[0]
                let scanName = currentCell.innerText
                scanTableIndices[scanName] = j
            }
        }
    })
    scanTable.dispatchEvent(itemAdded)
}
)

scanTable.addEventListener('itemAdded', (event) => {
    event.preventDefault()
    tobePaid.textContent = TotalCost
    tobePaidFinal.textContent = TotalCostAfterInsurance
})
scanTable.addEventListener('itemRemoved', (event) => {
    event.preventDefault()
    tobePaid.textContent = TotalCost
    tobePaidFinal.textContent = TotalCostAfterInsurance
})


finishButton.addEventListener('click', async (event) => {

    event.preventDefault()
    let medicineTable = document.getElementById('medicinesTable')
    let scanTable = document.getElementById('scansTable')
    let receiptDetails = {
        patient_email: localStorage.getItem('pEmail'),
        medicines: [],
        scans: [],
        insurance_discount_percentage: insurances[patientInsurance]
    }
    for (let i = 1; i < medicineTable.rows.length; i++) {
        let medicine = {}
        medicine.medicien_name = medicineTable.rows[i].cells[0].innerText
        medicine.medicien_Quantity = Number(medicineTable.rows[i].cells[2].innerText)
        receiptDetails.medicines.push(medicine)
    }
    for (let i = 1; i < scanTable.rows.length; i++) {
        let scan = {}
        scan.scan_name = scanTable.rows[i].cells[0].innerText
        scan.scan_Quantity = Number(scanTable.rows[i].cells[2].innerText)
        receiptDetails.scans.push(scan)
    }

    const response = await fetch('http://localhost:4000/api/makeReceipt', {
        method: 'PATCH',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(receiptDetails)
    })

    const responseData = await response.json()

    if (response.ok) {
        for (let i = 0; i < medicineTable.rows.length; i++) {
            medicineTable.rows[i].deleteCell(-1)
        }
        for (let j = 0; j < scanTable.rows.length; j++) {
            scanTable.rows[j].deleteCell(-1)
        }
        let dateFromDb = new Date();
        let localDate = new Date(dateFromDb.getTime() - dateFromDb.getTimezoneOffset() * 60000);
        let date = localDate.toISOString().split('T')[0];
        let time = localDate.toISOString().split('T')[1];
        let timeOnly = time.split('.')
        let time_ = timeOnly[0]
        let patientName = localStorage.getItem('pName')
        let doctorName = localStorage.getItem('doctorName')
        let patientEmail = localStorage.getItem('pEmail')
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.setFontSize(10)
        doc.text(`Date : ${date}`, 10, 10)
        doc.text(`Time : ${time_}`, 10, 20)
        doc.text(`Patient Name : ${patientName}`, 10, 30)
        doc.text(`Under the Supervision of ${doctorName}`, 10, 40)
        doc.text(`Total to be Paid before Insurance: ${TotalCost}`, 10, 50)
        doc.text(`Current Insurance : ${patientInsurance}`, 10, 60)
        doc.text(`Total to be Paid after Insurance: ${TotalCostAfterInsurance}`, 10, 70)
        // doc.html(document.getElementById('tables'), {
        //     callback: function (doc) {
        //         // Save the PDF locally
        //         doc.save(`Receipt ${patientName} ${date} ${time_}.pdf`);
        //     },
        //     x: 10,
        //     y: 80,
        //     width: 190, // Adjust the width to fit the PDF page
        //     windowWidth: tables.scrollWidth
        // })
        doc.autoTable({
            html: '#stables table',
            startY: 80,
            margin: { top: 10, right: 10, bottom: 10, left: 10 },
            styles: { overflow: 'linebreak', cellWidth: 'wrap' }
        });

        // Calculate the start position for the second table
        const finalY = doc.lastAutoTable.finalY || 20;

        // Add second table (reports)
        doc.autoTable({
            html: '#mtables table',
            startY: finalY + 20,  // Adjust the starting position for the second table
            margin: { top: 10, right: 10, bottom: 10, left: 10 },
            styles: { overflow: 'linebreak', cellWidth: 'wrap' }
        });
        
        const pdfBlob = doc.output('blob');

        const formData = new FormData();
        formData.append('pdf', pdfBlob);
        formData.append('dName', doctorName)
        formData.append('pName', patientName)
        formData.append('time', time_)
        formData.append('date', date)
        formData.append('pEmail' , patientEmail)
        const response_ = await fetch('http://localhost:4000/api/sendEmail', {
            method: 'POST',
            body: formData
        })
        let responseData = await response_.json()
        if (response_.ok) {
            alert('Email Sent Successfully')
            fetch("http://localhost:4000/doctorProfile")
                .then(() => window.location.href = '/doctorProfile')
        }
        else {
            alert(responseData.error)
            fetch("http://localhost:4000/doctorProfile")
                .then(() => window.location.href = '/doctorProfile')
        }
    }
    else {
        alert(responseData.msg)
    }
}
)

async function onloading() {
    let patientInsurance = localStorage.getItem('pinsurance')
    const insuranceHeader = document.getElementById('insuranceType')
    insuranceHeader.innerText = `Insurance Subscribed to : ${patientInsurance}`
    const patientName = document.getElementById('patientName')
    patientName.innerText = `Patient : ${localStorage.getItem('pName')}`
    const scanDropList = document.getElementById('scanType')

    const scanTypesResponse = await fetch('http://localhost:4000/api/getAllScans', {
        method: 'GET',
        credentials: 'include'
    })
    scanTypes = await scanTypesResponse.json()
    if (scanTypesResponse.ok) {
        for (let i = 0; i < scanTypes.data.length; i++) {
            let newScan = document.createElement('option')
            let newScanName = scanTypes.data[i].scan_name
            newScan.innerText = `${scanTypes.data[i].scan_name}`
            newScan.value = newScan.innerText
            scanDropList.appendChild(newScan)
            scanQuantities[newScanName] = 0
            scanFirstTime[newScanName] = true
        }
    }

    const medicineDropList = document.getElementById('medicineType')

    const medicineTypesResponse = await fetch('http://localhost:4000/api/getAvalableMedicines', {
        method: 'GET',
        credentials: 'include'
    })
    medicineTypes = await medicineTypesResponse.json()
    console.log(medicineTypes);
    if (medicineTypesResponse.ok) {
        for (let i = 0; i < medicineTypes.data.length; i++) {
            let newMed = document.createElement('option')
            newMedName = medicineTypes.data[i].medicine_name
            newMed.innerText = `${medicineTypes.data[i].medicine_name}`
            newMed.value = newMed.innerText
            medicineDropList.appendChild(newMed)
            medicineQuantities[newMedName] = 0
            medicineFirstTime[newMedName] = true
        }
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