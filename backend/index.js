require('dotenv').config();
const { Pool } = require('pg');
const express = require('express')
const httpStatusCodes = require('./utils/httpStatusCodes')
const app = express()
app.use(express.json())
const path = require('path')
const multer = require('multer')
const nodemailer = require('nodemailer')
const session = require('express-session');
const secretKey = require('./utils/secretKey')
const userType = require('./utils/userTypes');


app.use(session({
    secret: secretKey,
    resave: false,
    saveUninitialized: true
}));

let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;
const pool = new Pool({
    host: PGHOST,
    database: PGDATABASE,
    username: PGUSER,
    password: PGPASSWORD,
    port: 5432,
    ssl: {
        require: true,
    },
});

app.use(express.static('../frontend'))
app.use('/upload', express.static(path.join(__dirname, 'upload')));
app.use('/profilePhotos', express.static(path.join(__dirname, 'profilePhotos')));

app.get('/adminEditDoctor', async (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/adminEditDoctor.html'))
})
app.get('/homePage', async (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/HomePage.html'))
})
app.get('/login', async (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/login.html'))
})
app.get('/patientProfile', async (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/patientProfile.html'))
})

app.get('/doctorProfile', async (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/doctorProfile.html'))
})

app.get('/adminProfile', async (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/adminProfile.html'))
})
app.get('/editDoctor', async (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/editDoctor.html'))
})
app.get('/editPatient', async (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/editPatient.html'))
})

app.get('/register', async (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/Register.html'))
})

app.get('/makeAppointment', async (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/makeAppointment.html'))
})

app.get('/appointmentDetails', async (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/patientDetails.html'))
})

app.get('/makeReceipt', async (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/Receit.html'))
})

app.get('/doctorChangePassword', async (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/DoctorChangePassword.html'))
})

app.get('/patientChangePassword', async (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/PatientChangePassword.html'))
})

// Done Testing
app.post('/api/login', async (req, res) => {
    let result
    const { email, password, user_type } = req.body
    const client = await pool.connect();
    try {
        if (!(email && password)) {
            res.status(400).json({ status: httpStatusCodes.FAIL, msg: "You have to insert your email and password" })
            return
        }
        switch (user_type) {
            case userType.PATIENT:
                result = await client.query(`select p.email, p.password , p.last_name from patient p where p.email = '${email}'`);
                if (!result.rows.length) {
                    res.status(400).json({ status: httpStatusCodes.FAIL, msg: `Patient Not Found` })
                    return
                }
                break;

            case userType.DOCTOR:
                result = await client.query(`select d.email, d.password , d.last_name from doctor d where d.email = '${email}' and d.isfired = false`);
                if (!result.rows.length) {
                    res.status(400).json({ status: httpStatusCodes.FAIL, msg: `Doctor Not Found` })
                    return
                }
                if (result.rows[0].isFired === true) {
                    res.status(400).json({ status: httpStatusCodes.FAIL, msg: `You have been Fired` })
                    return
                }
                break

            case userType.ADMIN:
                result = await client.query(`select a.email, a.password , a.last_name from admin a where a.email = '${email}'`);
                if (!result.rows.length) {
                    res.status(400).json({ status: httpStatusCodes.FAIL, msg: `Doctor Not Found` })
                    return
                }
                break
        }
        const db_password = result.rows[0].password
        if (password === db_password) {
            req.session.email = email;
            res.status(200).json({ status: httpStatusCodes.SUCCESS, msg: "You have logged in successfully" })
        }
        else { res.status(500).json({ status: httpStatusCodes.FAIL, msg: "Wrong Password" }) }
        return
    }
    catch (error) {
        console.log(error);
    }
    finally {
        client.release();
    }
}
)


// Done Testing
// patient register
app.post('/api/PatientRegister', async (req, res) => {
    const { email, first_name, last_name, age, password, phone_number, gender } = req.body
    // console.log(email, first_name, last_name, age, password, phone_number)

    const client = await pool.connect();

    try {
        if (!(email && password && first_name && last_name && phone_number && age)) {
            res.status(400).json({ status: httpStatusCodes.FAIL, msg: "You have to insert all required fields" })
            return
        }
        const existingUser = await client.query(`select p.email from Patient p where p.email = '${email}'`);
        const existingPatientNumber = await client.query(`select p.phone_numbers from Patient_Phone_Numbers p where p.phone_numbers = '${phone_number}'`);
        const existingDoctorNumber = await client.query(`select p.phone_numbers from Doctor_Phone_Numbers p where p.phone_numbers = '${phone_number}'`);
        if (existingUser.rows.length) {
            res.status(500).json({ status: httpStatusCodes.FAIL, msg: "email already exists" })
            return
        }
        if (existingPatientNumber.rows.length || existingDoctorNumber.rows.length) {
            res.status(500).json({ status: httpStatusCodes.FAIL, msg: "phone number already exists" })
            return
        }
        await client.query(`insert into Patient(first_name, last_name, Age, email, password , gender , health_insurance) values('${first_name}', '${last_name}', ${age},  '${email}', '${password}' , '${gender}' , 'No_Insurance')`);
        // console.log("line 1")
        const patientId = await client.query(`select p.pid from Patient p where p.email = '${email}'`)
        // console.log("line 2")
        // console.log(patientId)
        await client.query(`insert into Patient_Phone_Numbers(phone_numbers, PID) values('${phone_number}', ${patientId.rows[0].pid})`)
        // console.log("line 3")
        res.status(200).json({ staus: httpStatusCodes.SUCCESS, msg: "patient registered succssesfully" })
    } catch (error) {
        console.log(error)
    } finally {
        client.release();
    }
})

// Done Testing
// doctor register
app.post('/api/doctorRegister', async (req, res) => {
    const { email, first_name, last_name, age, password, phone_number, position, gender } = req.body
    // console.log(email, first_name, last_name, age, password, phone_number, position)

    const client = await pool.connect();

    try {
        if (!(email && password && first_name && last_name && phone_number && age && position && gender)) {
            res.status(400).json({ status: httpStatusCodes.FAIL, msg: "You have to insert all required fields" })
            return
        }
        const existingUser = await client.query(`select d.email from Doctor d where d.email = '${email}'`);
        const existingPatientNumber = await client.query(`select p.phone_numbers from Patient_Phone_Numbers p where p.phone_numbers = '${phone_number}'`);
        const existingDoctorNumber = await client.query(`select p.phone_numbers from Doctor_Phone_Numbers p where p.phone_numbers = '${phone_number}'`);
        if (existingUser.rows.length) {
            res.json({ status: httpStatusCodes.FAIL, msg: "email already exists" })
            return
        }
        if (existingPatientNumber.rows.length || existingDoctorNumber.rows.length) {
            res.json({ status: httpStatusCodes.FAIL, msg: "phone number already exists" })
            return
        }
        await client.query(`insert into Doctor(first_name, last_name, Age, email, password, position , gender) values('${first_name}', '${last_name}', ${age},  '${email}', '${password}', '${position}', '${gender}' )`);
        // console.log("line 1")
        const doctorId = await client.query(`select d.did from Doctor d where d.email = '${email}'`)
        // console.log("line 2")
        // console.log(doctorId)
        await client.query(`insert into Doctor_Phone_Numbers(phone_numbers, DID) values('${phone_number}', ${doctorId.rows[0].did})`)
        // console.log("line 3")
        res.status(200).json({ staus: httpStatusCodes.SUCCESS, msg: "doctor registered succssesfully" })
    } catch (error) {
        console.log(error)
    } finally {
        client.release();
    }
})

// Done Testing
// get all reports 
// verification done
app.get('/api/getReports', async (req, res) => {
    const client = await pool.connect()
    try {
        const currEmail = req.session.email
        const id = await client.query(`select p.pid from patient p where p.email='${currEmail}'`)
        if (currEmail) {
            const reports = await client.query(`select r.Prescription , r.report_date , r.report_id from Report r where r.pid = '${id.rows[0].pid}'`)
            if (reports.rows.length) {
                for (let i = 0; i < reports.rows.length; i++) {
                    let reportDetails = {}
                    let reportID = reports.rows[i].report_id
                    let reportsScans = await client.query(`select scans from report_scans where report_id = ${reportID}`)
                    if (reportsScans.rows.length) {
                        let reportScanURL = reportsScans.rows[0].scans
                        reports.rows[i].scanURL = reportScanURL
                    }
                    let dateFromDb = new Date(reports.rows[i].report_date);
                    let localDate = new Date(dateFromDb.getTime() - dateFromDb.getTimezoneOffset() * 60000);
                    reports.rows[i].report_date = localDate.toISOString().split('T')[0];
                }
                res.status(200).json({ status: httpStatusCodes.SUCCESS, data: { reports: reports.rows } })
            }
            else {
                res.status(500).json({ status: httpStatusCodes.FAIL, msg: "No reports found" })
            }

        } else {
            res.status(500).json({ status: httpStatusCodes.FAIL, msg: "Session is expired, Please Login again" })
            return
        }
    }
    catch (err) {
        console.log(err)
    } finally {
        client.release()
    }
})

// get all reports 
// verification done
app.get('/api/getReportsforAppoint', async (req, res) => {
    const client = await pool.connect()
    try {
        const currEmail = req.query.pemail
        const id = await client.query(`select p.pid from patient p where p.email='${currEmail}'`)
        if (currEmail) {
            const reports = await client.query(`select r.Prescription , r.report_date , r.report_id from Report r where r.pid = '${id.rows[0].pid}'`)
            if (reports.rows.length) {
                for (let i = 0; i < reports.rows.length; i++) {
                    let reportDetails = {}
                    let reportID = reports.rows[i].report_id
                    let reportsScans = await client.query(`select scans from report_scans where report_id = ${reportID}`)
                    if (reportsScans.rows.length) {
                        let reportScanURL = reportsScans.rows[0].scans
                        reports.rows[i].scanURL = reportScanURL
                    }
                    let dateFromDb = new Date(reports.rows[i].report_date);
                    let localDate = new Date(dateFromDb.getTime() - dateFromDb.getTimezoneOffset() * 60000);
                    reports.rows[i].report_date = localDate.toISOString().split('T')[0];
                }
                res.status(200).json({ status: httpStatusCodes.SUCCESS, data: { reports: reports.rows } })
            }
            else {
                res.status(500).json({ status: httpStatusCodes.FAIL, msg: "No reports found" })
            }

        } else {
            res.status(500).json({ status: httpStatusCodes.FAIL, msg: "Session is expired, Please Login again" })
            return
        }
    }
    catch (err) {
        console.log(err)
    } finally {
        client.release()
    }
})

// Done Testing
// get all paient appoitments active and old 
// verification done 
app.get('/api/getAppointments', async (req, res) => {
    const client = await pool.connect()
    try {
        const currEmail = req.session.email
        const id = await client.query(`select p.pid from patient p where p.email='${currEmail}'`)
        if (currEmail) {
            const appointments = await client.query(`select a.time ,a.date,a.status, d.first_name, d.last_name, a.appid from Appointment a join doctor d on(d.did = a.did) where a.pid = ${id.rows[0].pid} and isfired = false order by a.date desc, a.time desc`)

            if (appointments.rows.length) {
                for (let i = 0; i < appointments.rows.length; i++) {

                    let dateFromDb = new Date(appointments.rows[i].date);
                    let localDate = new Date(dateFromDb.getTime() - dateFromDb.getTimezoneOffset() * 60000);
                    appointments.rows[i].date = localDate.toISOString().split('T')[0];
                }
                res.status(200).json({ status: httpStatusCodes.SUCCESS, data: { appointments: appointments.rows } })
            }
            else {
                res.status(400).json({ status: httpStatusCodes.FAIL, msg: "No appointments found" })
                return
            }
        } else {
            res.status(500).json({ status: httpStatusCodes.FAIL, msg: "Session is expired, Please Login again" })
            return
        }
    } catch (err) {
        console.log(err)
    } finally {
        client.release()
    }
})

// Done Testing
// edit pateint health status (just blood sugar level - pressure - type)
// verification done 
app.patch('/api/editHealthStatus', async (req, res) => {
    const client = await pool.connect();
    try {
        const { patientEmail, blood_sugar_level_, blood_pressure, blood_type } = req.body
        if (typeof blood_pressure === 'string' && typeof blood_sugar_level_ === 'number') {
            await client.query(`update patient set blood_pressure_ = '${blood_pressure}' where patient.email = '${patientEmail}'`)
            await client.query(`update patient set blood_sugar_level = ${blood_sugar_level_} where patient.email = '${patientEmail}'`)
            if (blood_type) {
                await client.query(`update patient set blood_type = '${blood_type}' where patient.email = '${patientEmail}'`)
            }
            res.status(200).json({ status: httpStatusCodes.SUCCESS, msg: "Edit Done Successfully" })
        }
        else {
            res.status(500).json({ status: httpStatusCodes.FAIL, msg: "Enter Valid Data" })
        }
    }
    catch (error) {
        console.log(error)
    } finally {
        client.release();
    }
})

app.get('/api/getHealthStatus', async (req, res) => {
    const client = await pool.connect();
    try {
        const patientEmail = req.query.pemail
        if (patientEmail) {
            const healthData = await client.query(`select p.blood_pressure_ , p.blood_sugar_level , p.blood_type from patient p where p.email= '${patientEmail}'`)
            res.status(200).json({ status: httpStatusCodes.SUCCESS, data: healthData.rows })
        }
        else {
            res.status(500).json({ status: httpStatusCodes.FAIL, msg: "Error" })
        }
    }
    catch (error) {
        console.log(error)
    } finally {
        client.release();
    }
})

// Done Testing
// edit doctor
//verification done
app.patch('/api/editDoctor', async (req, res) => {
    const client = await pool.connect();
    try {
        const DoctorEmail = req.session.email
        if (!DoctorEmail) {
            res.status(400).json({ status: httpStatusCodes.ERROR, msg: "Session Expired, Please Login again" })
            return
        }
        const { first_name, last_name, age, imageUrl, phone_number } = req.body
        if (typeof first_name === 'string' || typeof first_name === 'string') {
            const id = await client.query(`select d.did from doctor d where d.email='${DoctorEmail}'`)
            const old_phone_numbers = await client.query(`select d.Phone_Numbers from Doctor_Phone_Numbers d where d.did = '${id.rows[0].did}'`)
            var flag = 0;
            for (var i = 0; i < old_phone_numbers.rows.length; i++) {
                if (phone_number === old_phone_numbers.rows[i].phone_numbers) flag = 1;
            }
            if (flag) {
                await client.query(`update doctor set First_Name = '${first_name}', Last_Name = '${last_name}', age='${age}',photo = '${req.session.imageUrl}' where Email = '${DoctorEmail}'`);
            }
            else {
                await client.query(`update doctor set First_Name = '${first_name}', Last_Name = '${last_name}', age='${age}',photo = '${req.session.imageUrl}' where Email = '${DoctorEmail}'`)
                await client.query(`insert into Doctor_Phone_Numbers (phone_numbers,did) values (${phone_number},${id.rows[0].did})`)
            };
            res.status(200).json({ status: httpStatusCodes.SUCCESS, msg: "User updated sucessfully" })
        }
        else {
            res.status(500).json({ status: httpStatusCodes.FAIL, msg: "First Name and Second Name must be strings " })
        }
    }
    catch (error) {
        console.log(error)
    } finally {
        client.release();
    }
})

app.patch('/api/editAdminDoctor', async (req, res) => {
    const client = await pool.connect();
    try {
        const AdminEmail = req.session.email
        if (!AdminEmail) {
            res.status(400).json({ status: httpStatusCodes.ERROR, msg: "Session Expired, Please Login again" })
            return
        }
        const { first_name, last_name, age, phone_number, position, DoctorEmail , photo} = req.body
        if (typeof first_name === 'string' || typeof first_name === 'string') {
            const id = await client.query(`select d.did from doctor d where d.email='${DoctorEmail}'`)
            const old_phone_numbers = await client.query(`select d.Phone_Numbers from Doctor_Phone_Numbers d where d.did = '${id.rows[0].did}'`)
            var flag = 0;
            for (var i = 0; i < old_phone_numbers.rows.length; i++) {
                if (phone_number === old_phone_numbers.rows[i].phone_numbers) flag = 1;
            }
            if (flag) {
                await client.query(`update doctor set First_Name = '${first_name}', Last_Name = '${last_name}', age='${age}' , position ='${position}' , photo ='${photo}' where Email = '${DoctorEmail}'`);
            }
            else {
                await client.query(`update doctor set First_Name = '${first_name}', Last_Name = '${last_name}', age='${age}', position ='${position}', photo ='${photo}' where Email = '${DoctorEmail}'`)
                await client.query(`insert into Doctor_Phone_Numbers (phone_numbers,did) values (${phone_number},${id.rows[0].did})`)
            };
            res.status(200).json({ status: httpStatusCodes.SUCCESS, msg: "User updated sucessfully" })
        }
        else {
            res.status(500).json({ status: httpStatusCodes.FAIL, msg: "First Name and Second Name must be strings " })
        }
    }
    catch (error) {
        console.log(error)
    } finally {
        client.release();
    }
})

// Done Testing
// edit patient
//verification done
app.patch('/api/editPatient', async (req, res) => {
    const client = await pool.connect();
    try {
        const patientEmail = req.session.email
        const id = await client.query(`select p.pid from patient p where p.email='${patientEmail}'`)
        const { first_name, last_name, age, phone_number, insurance } = req.body
        // console.log(id);
        if (typeof first_name === 'string' || typeof first_name === 'string') {
            const old_phone_numbers = await client.query(`select u.phone_numbers from Patient_Phone_Numbers u where u.pid = '${id.rows[0].pid}'`)
            var flag = 0;
            for (var i = 0; i < old_phone_numbers.rows.length; i++) {
                if (phone_number === old_phone_numbers.rows[i].phone_numbers) flag = 1;
            }
            if (flag) {
                await client.query(`update patient set First_Name = '${first_name}', Last_Name = '${last_name}', age=${age} , health_insurance='${insurance}' where pid = '${id.rows[0].pid}'`);
            }
            else {
                await client.query(`update patient set First_Name = '${first_name}', Last_Name = '${last_name}', age=${age} , health_insurance='${insurance}' where pid = '${id.rows[0].pid}'`);
                await client.query(`insert into Patient_Phone_Numbers (phone_numbers,pid) values (${phone_number},${id.rows[0].pid})`)
            }
            res.status(200).json({ staus: httpStatusCodes.SUCCESS, msg: "User updated sucessfully" })
        }
        else {
            res.status(500).json({ status: httpStatusCodes.FAIL, msg: "First Name and Second Name must be strings " })
        }
    } catch (error) {
        console.log(error)
    } finally {
        client.release();
    }
})

// Done Testing
// send message 
app.patch('/api/sendMessage', async (req, res) => {
    const client = await pool.connect()
    try {
        currEmail = req.session.email
        const { receiverEmail, data, _userType } = req.body
        console.log
        if (currEmail) {
            if (receiverEmail) {
                if (data) {
                    if (_userType === userType.DOCTOR) {
                        const doctorId = await client.query(`select d.did from Doctor d where d.email = '${currEmail}'`)
                        const patientId = await client.query(`select p.pid from patient p where p.email = '${receiverEmail}'`)
                        if (doctorId.rows.length && patientId.rows.length) {
                            client.query(`insert into messages(did, pid, Sender, Receiver, Content) values(${doctorId.rows[0].did}, ${patientId.rows[0].pid}, '${currEmail}', '${receiverEmail}', '${data}')`)
                            res.status(200).json({ status: httpStatusCodes.SUCCESS, msg: "message sent successfuly" })
                            return
                        } else {
                            res.status(500).json({ status: httpStatusCodes.FAIL, msg: "reciver email not found" })
                            return
                        }
                    } else {
                        const patientId = await client.query(`select p.pid from patient p where p.email = '${currEmail}'`)
                        const doctorId = await client.query(`select d.did from Doctor d where d.email = '${receiverEmail}'`)
                        if (doctorId.rows.length && patientId.rows.length) {
                            client.query(`insert into messages(did, pid, Sender, Receiver, Content) values(${doctorId.rows[0].did}, ${patientId.rows[0].pid}, '${currEmail}', '${receiverEmail}', '${data}')`)
                            res.status(200).json({ status: httpStatusCodes.SUCCESS, msg: "message sent successfuly" })
                            return
                        } else {
                            res.status(500).json({ status: httpStatusCodes.FAIL, msg: "reciver email not found not found" })
                            return
                        }
                    }
                } else {
                    res.status(500).json({ status: httpStatusCodes.FAIL, msg: "please enter the message" })
                    return
                }
            } else {
                res.status(500).json({ status: httpStatusCodes.FAIL, msg: "user not found" })
                return
            }
        } else {
            res.status(500).json({ status: httpStatusCodes.FAIL, msg: "session is expired" })
            return
        }
    } catch (err) {
        console.log(err)
    } finally {
        client.release()
    }
})

// Done Testing
// get all messeges 
app.get('/api/getMessages', async (req, res) => {
    const client = await pool.connect()
    try {
        const currEmail = req.session.email
        if (currEmail) {
            const messages = await client.query(`select m.sender,m.receiver, m.date, m.time, m.content from messages m where m.receiver = '${currEmail}'`)
            if (messages.rows.length) {
                res.status(200).json({ status: httpStatusCodes.SUCCESS, data: { messages: messages.rows } })
            }
            else {
                res.status(500).json({ status: httpStatusCodes.FAIL, msg: "No messages found" })
            }
        } else {
            res.status(500).json({ status: httpStatusCodes.FAIL, msg: "session is expired" })
            return
        }
    } catch (err) {
        console.log(err)
    } finally {
        client.release()
    }
})

// Done Testing
// get current patient (session)
app.get('/api/getPatient', async (req, res) => {
    const client = await pool.connect()
    try {
        const patientEmail = req.session.email
        if (!patientEmail) {
            res.status(400).json({ status: httpStatusCodes.ERROR, msg: "Session Expired, Please Login again" })
            return
        }
        else {
            const pID = await client.query(`select p.pid from patient p where p.email='${patientEmail}'`)
            const phone_number = await client.query(`select p.Phone_Numbers from Patient_Phone_Numbers p where p.pid=${pID.rows[0].pid}`)
            const patients = await client.query(`select p.email, p.first_name, p.last_name,p.email, p.age,p.Blood_Pressure_,p.Blood_Sugar_Level,p.Blood_Type,p.Health_Insurance, p.photo , p.gender from patient p where p.email = '${patientEmail}'`)
            if (patients.rows.length) {
                res.status(200).json({ status: httpStatusCodes.SUCCESS, data: { patients: patients.rows[0], phone_numbers: phone_number.rows } })
            }
            else {
                res.status(200).json({ status: httpStatusCodes.SUCCESS, msg: "no patients found" })
            }
        }
    } catch (error) {
        console.log(error)
    } finally {
        client.release();
    }
})
app.get('/api/getPatientwithID', async (req, res) => {
    const client = await pool.connect()
    try {
        const patientID = req.query.pid
        if (!patientID) {
            res.status(400).json({ status: httpStatusCodes.ERROR, msg: "Error" })
            return
        }
        else {
            if(patientID){
                const phone_number = await client.query(`select p.Phone_Numbers from Patient_Phone_Numbers p where p.pid=${patientID}`)
                const patients = await client.query(`select p.email, p.first_name, p.last_name,p.email, p.age,p.Blood_Pressure_,p.Blood_Sugar_Level,p.Blood_Type,p.Health_Insurance, p.photo, p.gender  from patient p where p.pid = ${patientID}`)
                if (patients.rows.length) {
                    res.status(200).json({ status: httpStatusCodes.SUCCESS, data: { patients: patients.rows[0], phone_numbers: phone_number.rows } })
                }
                else {
                    res.status(200).json({ status: httpStatusCodes.SUCCESS, msg: "no patients found" })
                }
            }
        }
    } catch (error) {
        console.log(error)
    } finally {
        client.release();
    }
})

// get Patients that reserved an appointment for the signed in Doctor
app.get('/api/getDoctorPatient', async (req, res) => {
    const client = await pool.connect()
    try {
        const doctorEmail = req.session.email
        if (!doctorEmail) {
            res.status(400).json({ status: httpStatusCodes.ERROR, msg: "Session Expired, Please Login again" })
            return
        }
        else {
            const dID = await client.query(`select d.did from doctor d where d.email='${doctorEmail}'`)
            const pID = await client.query(`select distinct a.pid from appointment a where a.did = ${dID.rows[0].did} and a.status = 'Reserved'`)
            const pidArray = pID.rows
            const pidList = pidArray.map(item => item.pid).join(', ');
            const patients = await client.query(`select p.email, p.first_name, p.last_name from patient p where p.pid in (${pidList})`)
            if (patients.rows.length) {
                res.status(200).json({ status: httpStatusCodes.SUCCESS, data: { patients: patients.rows } })
            }
            else {
                res.status(200).json({ status: httpStatusCodes.SUCCESS, msg: "no patients found" })
            }
        }
    } catch (error) {
        console.log(error)
    } finally {
        client.release();
    }
})


// Done testing
// get current admin (session)
app.get('/api/getCurrentAdmin', async (req, res) => {
    const client = await pool.connect()
    try {
        const adminEmail = req.session.email
        if (!adminEmail) {
            res.status(500).json({ status: httpStatusCodes.FAIL, msg: "Session Expired, Please Login again" })
        } else {
            const aId = await client.query(`select a.aid from admin a where a.email = '${adminEmail}'`)
            const phoneNumber = await client.query(`select a.Phone_Number from admin_Phone_Number a where a.aid=${aId.rows[0].aid}`)
            const admins = await client.query(`select a.email, a.first_name, a.last_name,a.email, a.age , a.photo from admin a where a.email = '${adminEmail}'`)
            if (admins.rows.length) {
                res.status(200).json({ status: httpStatusCodes.SUCCESS, data: { admins: admins.rows[0], phone_numbers: phoneNumber.rows } })
            }
            else {
                res.status(200).json({ status: httpStatusCodes.SUCCESS, msg: "no admin found" })
            }
        }
    } catch (err) {
        console.log(err)
    } finally {
        client.release()
    }
})

// Done Testing
// get all patients
app.get('/api/getPatients', async (req, res) => {
    const client = await pool.connect()
    try {
        final_result = []
        single_patient = []
        patients = await client.query(`select p.pid , p.first_name, p.last_name,p.email, p.age , p.blood_pressure_ , p.blood_sugar_level , p.blood_type from patient p`)
        for (var i = 0; i < patients.rows.length; i++) {
            single_patient.push(patients.rows[i])
            single_pid = patients.rows[i].pid
            phone_number = await client.query(`select p.Phone_Numbers from Patient_Phone_Numbers p where p.pid = ${single_pid}`)
            for (var j = 0; j < phone_number.rows.length; j++) {
                single_patient.push(phone_number.rows[j].phone_numbers)
            }
            final_result.push(single_patient)
            single_patient = []

        }
        if (patients.rows.length) {
            res.status(200).json({ status: httpStatusCodes.SUCCESS, data: { patients: final_result } })
        } else {
            res.status(200).json({ status: httpStatusCodes.SUCCESS, msg: "no patients found" })
        }

    } catch (error) {
        console.log(error)
    } finally {
        client.release();
    }
})
app.post('/api/searchPatient', async (req, res) => {
    console.log("hey")
    const client = await pool.connect()
    try {
        const { fName, lName } = req.body
        if (fName && lName) {
            const pID = await client.query(`select p.pid from patient p where p.first_name ILIKE '%${fName}%' and p.last_name ILIKE '%${lName}%'`)
            console.log(pID)
            const patients = await client.query(`SELECT p.pid, p.first_name, p.last_name, p.email, p.age, p.Blood_Pressure_, p.Blood_Sugar_Level, p.Blood_Type, p.Health_Insurance FROM patient p WHERE  p.first_name ILIKE '%${fName}%' and p.last_name ILIKE '%${lName}%'`);
            console.log("hello")
            console.log(patients)
            final_result = []
            single_patient = []

            for (var i = 0; i < patients.rows.length; i++) {
                single_patient.push(patients.rows[i])
                var single_pid = patients.rows[i].pid
                var phone_number = await client.query(`select p.Phone_Numbers from Patient_Phone_Numbers p where p.pid = ${single_pid}`)
                single_patient[i].phone_numbers = []
                for (var j = 0; j < phone_number.rows.length; j++) {
                    single_patient[i].phone_numbers.push(phone_number.rows[j].phone_numbers)
                }


            }
            if (patients.rows.length > 0) {
                res.status(200).json({ status: httpStatusCodes.SUCCESS, data: single_patient })
            }
            else {
                res.status(200).json({ status: httpStatusCodes.SUCCESS, msg: "no patients found" })
            }
        }
        else if (fName && !lName) {

            const pID = await client.query(`select p.pid from patient p where p.first_name ILIKE '%${fName}%'`)
            console.log("heelooo")
            const patients = await client.query(`SELECT p.pid, p.first_name, p.last_name, p.email, p.age, p.Blood_Pressure_, p.Blood_Sugar_Level, p.Blood_Type, p.Health_Insurance FROM patient p WHERE  p.first_name ILIKE '%${fName}%'`);
            console.log("hello")
            console.log(patients)
            final_result = []
            single_patient = []

            for (var i = 0; i < patients.rows.length; i++) {
                single_patient.push(patients.rows[i])
                var single_pid = patients.rows[i].pid
                var phone_number = await client.query(`select p.Phone_Numbers from Patient_Phone_Numbers p where p.pid = ${single_pid}`)
                single_patient[i].phone_numbers = []
                for (var j = 0; j < phone_number.rows.length; j++) {
                    single_patient[i].phone_numbers.push(phone_number.rows[j].phone_numbers)
                }


            }
            if (patients.rows.length > 0) {
                res.status(200).json({ status: httpStatusCodes.SUCCESS, data: single_patient })
            }
            else {
                res.status(200).json({ status: httpStatusCodes.SUCCESS, msg: "no patients found" })
            }

        }





    } catch (error) {
        console.log(error)
    }
})

app.post('/api/searchDoctor', async (req, res) => {
    console.log("hey")
    const client = await pool.connect()
    try {
        const { fName, lName } = req.body
        if (fName && lName) {
            const dID = await client.query(`select d.did from doctor d where d.first_name ILIKE '%${fName}%' and d.last_name ILIKE '%${lName}%'`)
            console.log(dID)
            const doctors = await client.query(`SELECT d.did, d.first_name, d.last_name, d.email, d.age, d.position, d.gender, d.isFired FROM doctor d WHERE  d.first_name ILIKE '%${fName}%' and d.last_name ILIKE '%${lName}%'`);
            console.log("hello")
            console.log(doctors)
            final_result = []
            single_doctor = []

            for (var i = 0; i < doctors.rows.length; i++) {
                single_doctor.push(doctors.rows[i])
                var single_did = doctors.rows[i].did
                var phone_number = await client.query(`select d.Phone_Numbers from Doctor_Phone_Numbers d where d.did = ${single_did}`)
                single_doctor[i].phone_numbers = []
                for (var j = 0; j < phone_number.rows.length; j++) {
                    single_doctor[i].phone_numbers.push(phone_number.rows[j].phone_numbers)
                }


            }
            if (doctors.rows.length > 0) {
                res.status(200).json({ status: httpStatusCodes.SUCCESS, data: single_doctor })
            }
            else {
                res.status(200).json({ status: httpStatusCodes.SUCCESS, msg: "no doctors found" })
            }
        }
        else if (fName && !lName) {

            const dID = await client.query(`select d.did from doctor d where d.first_name ILIKE '%${fName}%'`)
            console.log("heelooo")
            const doctors = await client.query(`SELECT d.did, d.first_name, d.last_name, d.email, d.age, d.position, d.gender , d.isFired FROM doctor d WHERE  d.first_name ILIKE '%${fName}%'`);
            console.log("hello")
            console.log(doctors)
            final_result = []
            single_doctor = []

            for (var i = 0; i < doctors.rows.length; i++) {
                single_doctor.push(doctors.rows[i])
                var single_did = doctors.rows[i].did
                var phone_number = await client.query(`select d.Phone_Numbers from Doctor_Phone_Numbers d where d.did = ${single_did}`)
                single_doctor[i].phone_numbers = []
                for (var j = 0; j < phone_number.rows.length; j++) {
                    single_doctor[i].phone_numbers.push(phone_number.rows[j].phone_numbers)
                }


            }
            if (doctors.rows.length > 0) {
                res.status(200).json({ status: httpStatusCodes.SUCCESS, data: single_doctor })
            }
            else {
                res.status(200).json({ status: httpStatusCodes.SUCCESS, msg: "no doctors found" })
            }

        }





    } catch (error) {
        console.log(error)
    }
})
// Done Testing
// get current doctor (session)
app.get('/api/getCurrentDoctor', async (req, res) => {
    const client = await pool.connect()
    try {
        const doctorEmail = req.session.email
        if (!doctorEmail) {
            res.status(400).json({ status: httpStatusCodes.ERROR, msg: "Session Expired, Please Login again" })
            return
        }
        else {
            const DID = await client.query(`select d.did from doctor d where d.email='${doctorEmail}'`)
            const doctors = await client.query(`select d.first_name, d.last_name,d.email, d.age , d.position , d.photo from Doctor d where d.email = '${doctorEmail}'`)
            const phone_number_doctor = await client.query(`select d.Phone_Numbers from doctor_phone_numbers d where d.did=${DID.rows[0].did}`)
            if (doctors.rows.length && phone_number_doctor.rows.length) {
                res.status(200).json({ status: httpStatusCodes.SUCCESS, data: { doctors: doctors.rows[0], phone_numbers: phone_number_doctor.rows } })
            } else {
                res.status(200).json({ status: httpStatusCodes.SUCCESS, msg: "no doctors found" })
            }
        }
    } catch (error) {
        console.log(error)
    } finally {
        client.release();
    }
})

app.get('/api/getCurrentDoctorFromAdmin', async (req, res) => {
    const client = await pool.connect()
    try {
        const doctorEmail = req.query.demail
        // console.log(doctorEmail);
        if (!doctorEmail) {
            res.status(400).json({ status: httpStatusCodes.ERROR, msg: "Session Expired, Please Login again" })
            return
        }
        else {
            const DID = await client.query(`select d.did from doctor d where d.email=${doctorEmail}`)
            const doctors = await client.query(`select d.first_name, d.last_name,d.email, d.age , d.position , d.photo from Doctor d where d.email = ${doctorEmail}`)
            const phone_number_doctor = await client.query(`select d.Phone_Numbers from doctor_phone_numbers d where d.did=${DID.rows[0].did}`)
            if (doctors.rows.length && phone_number_doctor.rows.length) {
                res.status(200).json({ status: httpStatusCodes.SUCCESS, data: { doctors: doctors.rows[0], phone_numbers: phone_number_doctor.rows } })
            } else {
                res.status(200).json({ status: httpStatusCodes.SUCCESS, msg: "no doctors found" })
            }
        }
    } catch (error) {
        console.log(error)
    } finally {
        client.release();
    }
})

// Done Testing
app.get('/api/getDoctors', async (req, res) => {
    const client = await pool.connect()
    try {
        final_result_doctors = []
        single_doctor = []
        const doctors = await client.query(`select d.did , d.first_name, d.last_name,d.email, d.age , d.position, d.photo from Doctor d where d.isFired = false`)
        for (var i = 0; i < doctors.rows.length; i++) {
            single_doctor.push(doctors.rows[i])
            single_did = doctors.rows[i].did
            phone_number_doctor_ = await client.query(`select d.Phone_Numbers from doctor_Phone_Numbers d where d.did = ${single_did}`)
            for (var j = 0; j < phone_number_doctor_.rows.length; j++) {
                single_doctor.push(phone_number_doctor_.rows[j].phone_numbers)
            }
            final_result_doctors.push(single_doctor)
            single_doctor = []

        }

        if (doctors.rows.length) {
            res.status(200).json({ status: httpStatusCodes.SUCCESS, data: { doctors: final_result_doctors } })
        } else {
            res.status(200).json({ status: httpStatusCodes.SUCCESS, msg: "no doctors found" })
        }

    } catch (error) {
        console.log(error)
    } finally {
        client.release();
    }
})

app.get('/api/getDoctorsforSearch', async (req, res) => {
    const client = await pool.connect()
    try {
        final_result_doctors = []
        single_doctor = []
        const doctors = await client.query(`select d.did , d.first_name, d.last_name,d.email, d.age , d.position , d.isFired from Doctor d`)
        for (var i = 0; i < doctors.rows.length; i++) {
            single_doctor.push(doctors.rows[i])
            single_did = doctors.rows[i].did
            phone_number_doctor_ = await client.query(`select d.Phone_Numbers from doctor_Phone_Numbers d where d.did = ${single_did}`)
            for (var j = 0; j < phone_number_doctor_.rows.length; j++) {
                single_doctor.push(phone_number_doctor_.rows[j].phone_numbers)
            }
            final_result_doctors.push(single_doctor)
            single_doctor = []

        }

        if (doctors.rows.length) {
            res.status(200).json({ status: httpStatusCodes.SUCCESS, data: { doctors: final_result_doctors } })
        } else {
            res.status(200).json({ status: httpStatusCodes.SUCCESS, msg: "no doctors found" })
        }

    } catch (error) {
        console.log(error)
    } finally {
        client.release();
    }
})

// Done Testing
// get all avalable appoitments 
app.get("/api/getallappoints", async (req, res) => {
    const client = await pool.connect()
    try {
        const demail = req.query.demail
        // const { dname } = req.body
        // const dfullname = dname.split(' ')
        // const dfirstname = dfullname[0]
        // const dlastname = dfullname[1]

        const doctorData = await client.query(`Select DID , first_name , last_name from doctor where email = '${demail}'`)

        const availappoint = await client.query(`select date , time from appointment where did = ${doctorData.rows[0].did} and status = 'Free' order by date , time`)
        if (!availappoint.rows.length) {
            res.status(404).json({ status: httpStatusCodes.FAIL, msg: `No available appointments available for the doctor ${doctorData.rows[0].first_name} ${doctorData.rows[0].last_name}` })
        }
        else {
            for (let i = 0; i < availappoint.rows.length; i++) {

                let dateFromDb = new Date(availappoint.rows[i].date);
                let localDate = new Date(dateFromDb.getTime() - dateFromDb.getTimezoneOffset() * 60000);
                availappoint.rows[i].date = localDate.toISOString().split('T')[0];
            }
            res.status(200).json({ status: httpStatusCodes.SUCCESS, data: availappoint.rows })
        }
    }
    catch (error) {
        console.log(error);
    }
    finally {
        client.release()
    }
})

// get all reserved appoitments -- Doctor Side
app.get("/api/getallreservedappoints", async (req, res) => {
    const client = await pool.connect()
    try {
        const doctorData = await client.query(`Select DID , first_name , last_name from doctor where email = '${req.session.email}'`)
        const reservedappoint = await client.query(`select date , time , pid from appointment where did = ${doctorData.rows[0].did} and status = 'Reserved' order by date , time`)
        if (!reservedappoint.rows.length) {
            res.status(404).json({ status: httpStatusCodes.FAIL, msg: `No available appointments available for the doctor ${doctorData.rows[0].first_name} ${doctorData.rows[0].last_name}` })
        }
        else {
            for (let i = 0; i < reservedappoint.rows.length; i++) {
                // let reservedPatientID = reservedappoint.rows[i].pid
                // const patientEmail = await client.query(`select email from patient where pid = ${reservedPatientID}`)
                // reservedappoint.rows[i].pemail = patientEmail.rows[0].email
                let dateFromDb = new Date(reservedappoint.rows[i].date);
                let localDate = new Date(dateFromDb.getTime() - dateFromDb.getTimezoneOffset() * 60000);
                reservedappoint.rows[i].date = localDate.toISOString().split('T')[0];
            }
            res.status(200).json({ status: httpStatusCodes.SUCCESS, data: reservedappoint.rows })
        }
    }
    catch (error) {
        console.log(error);
    }
    finally {
        client.release()
    }
})

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'upload/') // save uploaded files to the 'uploads' directory
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // rename uploaded files
    }
});

const upload = multer({ storage: storage });

// Done Testing
// make a report
app.post('/api/makereport', upload.single('scan'), async (req, res) => {
    const client = await pool.connect()
    try {
        const prescriptiondetails = req.body.prescriptionContent
        const patientEmail = req.body.pemail
        const scan = req.file
        const patientIDobj = await client.query(`Select pid from patient where email = '${patientEmail}'`)
        const doctorIDobj = await client.query(`Select DID from doctor where email = '${req.session.email}'`)
        if (!doctorIDobj.rows.length) {
            res.status(400).json({ status: httpStatusCodes.ERROR, msg: "Session Expired, Please Login Again" })
            return
        }
        const doctorID = doctorIDobj.rows[0].did
        if (!prescriptiondetails || !patientIDobj.rows.length) {
            res.status(400).json({ status: httpStatusCodes.ERROR, msg: "Report must contain prescription and Patient Name" })
            return
        }
        await client.query(`insert into report(prescription , did , pid) values ('${prescriptiondetails}' , ${doctorID} ,${patientIDobj.rows[0].pid} )`)
        if (!scan) {
            res.status(200).json({ status: httpStatusCodes.SUCCESS, msg: "Report made successfully , No Scans were attached" })
        }
        else {
            const reportID = await client.query(`select report_id from report where pid = ${patientIDobj.rows[0].pid}`)
            let report_ids_length = reportID.rows.length
            const imageUrl = scan.path;
            await client.query(`insert into report_scans (scans , report_id) values ('${imageUrl}' , ${reportID.rows[report_ids_length - 1].report_id})`)
            res.status(200).json({ status: httpStatusCodes.SUCCESS, msg: "Report made successfully with attached Scans Uploaded" })
        }
    }
    catch (error) {
        res.status(400).json({ status: httpStatusCodes.ERROR, msg: error })
    }
    finally {
        client.release()
    }
})

// Done Testing
// make an appoitment, patient side 
app.post("/api/makeappoint", async (req, res) => {
    const client = await pool.connect()
    try {
        const { date, time, demail } = req.body
        // console.log(date);
        const doctor_DATA = await client.query(`Select DID , first_name from doctor where email = '${demail}'`)
        const pemail = req.session.email
        if (!pemail) {
            res.status(400).json({ status: httpStatusCodes.ERROR, msg: "Session Expired, Please Login Again" })
            return
        }
        const current_appoints = await client.query(`select * from appointment where Time='${time}' and Date='${date}' and Status = 'Free' and DID = ${doctor_DATA.rows[0].did}`)
        if (!current_appoints.rows.length) {
            res.status(400).json({ status: httpStatusCodes.FAIL, msg: "Selected appointment time is already reserved" })
            return
        }
        else {
            const patientID = await client.query(`Select PID from patient where Email = '${pemail}'`)
            await client.query(`Update appointment set Status = 'Reserved' , PID = ${patientID.rows[0].pid}  where Time ='${time}' and Date='${date}' and DID = ${doctor_DATA.rows[0].did}`)
            res.status(200).json({ status: httpStatusCodes.SUCCESS, msg: `Appointment reserved successfully at Time : '${time}' and Date : '${date}' with Dr: '${doctor_DATA.rows[0].first_name}'` })
        }
    }
    catch (error) {
        console.log(error);
    }
    finally {
        client.release()
    }
})


// Done testing 
// make appontments for the doctor
app.patch('/api/addAppointment', async (req, res) => {
    const client = await pool.connect()
    try {
        const doctorEmail = req.session.email
        if (doctorEmail) {
            const { date, time } = req.body
            if (date && time) {
                let doctorData = await client.query(`select did from doctor where email = '${doctorEmail}'`)
                doctorId = doctorData.rows[0].did
                if (doctorId) {
                    client.query(`insert into appointment(date , status , time , did ) values ('${date}' , 'Free' , '${time}' , ${doctorId})`)
                    res.status(200).json({ status: httpStatusCodes.SUCCESS, msg: "appintment added to your shudule successfuly" })
                } else {
                    res.status(400).json({ status: httpStatusCodes.ERROR, msg: "no id found" })
                    return
                }
            } else {
                res.status(400).json({ status: httpStatusCodes.ERROR, msg: "please enter the date and the time" })
                return
            }
        } else {
            res.status(400).json({ status: httpStatusCodes.ERROR, msg: "Session Expired, Please Login Again" })
            return
        }
    } catch (err) {
        console.log(err)
    } finally {
        client.release()
    }
})

// done testing
// get post and upcoming appointments for the patient
app.get('/api/getAppointmentsInfoPatient', async (req, res) => {
    const client = await pool.connect()
    try {
        const patientID = await client.query(`Select PID from patient where Email = '${req.session.email}'  `)
        if (!req.session.email) {
            res.status(400).json({ status: httpStatusCodes.ERROR, msg: "Session Expired, Please Login Again" })
            return
        } else {
            const upcoming = await client.query(`select count(ap.appid) as upcoming from appointment ap where ap.pid = ${patientID.rows[0].pid} and ap.date > current_date`)
            const post = await client.query(`select count(ap.appid) as post from appointment ap where ap.pid = ${patientID.rows[0].pid} and ap.date < current_date`)
            if (!(upcoming && post)) {
                res.status(400).json({ status: httpStatusCodes.ERROR, msg: "error occured" })
                return
            } else {
                res.status(200).json({ status: httpStatusCodes.SUCCESS, data: { post: post.rows[0].post, upcoming: upcoming.rows[0].upcoming } })
                return
            }

        }
    } catch (err) {
        console.log(err)
    } finally {
        client.release()
    }
})

// done testing
// get post and upcoming appointments for the doctor
app.get('/api/getAppointmentsInfoDoctors', async (req, res) => {
    const client = await pool.connect()
    try {
        const doctorEmail = req.session.email
        if (doctorEmail) {
            const DocId = await client.query(`select did from doctor where email = '${doctorEmail}'`)
            const upcoming = await client.query(`select count(ap.appid) as upcoming from appointment ap where ap.did = ${DocId.rows[0].did} and ap.date > current_date and ap.status = 'Reserved'`)
            const post = await client.query(`select count(ap.appid) as post from appointment ap where ap.did = ${DocId.rows[0].did} and ap.date < current_date`)
            if (upcoming.rows[0].upcoming && post.rows[0].post) {
                res.status(200).json({ status: httpStatusCodes.SUCCESS, data: { post: post.rows[0].post, upcoming: upcoming.rows[0].upcoming } })
                return
            } else {
                res.status(400).json({ status: httpStatusCodes.ERROR, msg: "error occured" })
                return
            }
        } else {
            res.status(400).json({ status: httpStatusCodes.ERROR, msg: "Session Expired, Please Login Again" })
            return
        }
    } catch (err) {
        console.log(err)
    } finally {
        client.release()
    }
})

// done testing
// get satistics for the admin page
app.get('/api/getStatistics', async (req, res) => {
    const client = await pool.connect()
    try {
        const numberOfPatients = await client.query(`select count(p.pid) as num_of_patients from patient p`)
        const numberOfDoctor = await client.query(`select count(d.did) as num_of_doctors from doctor d`)
        const upcomingReservations = await client.query(`select count(ap.appid) as upcoming_appointments from appointment ap where ap.date >= current_date`)
        const lastWeekAppointments = await client.query(`SELECT COUNT(*) AS last_week_appointments FROM Appointment WHERE Date >= CURRENT_DATE - INTERVAL '7' DAY AND Date < CURRENT_DATE`)
        const lastMonthAppointments = await client.query(`select count(*) as last_month_appointments from Appointment where date >= current_date - interval '30' day and date < current_date`)
        const mediciens = await client.query(`select * from medicine`)
        if (numberOfDoctor && numberOfPatients && upcomingReservations && lastMonthAppointments && lastWeekAppointments) {
            res.status(200).json({
                status: httpStatusCodes.SUCCESS, data: {
                    num_of_patients: numberOfPatients.rows[0].num_of_patients,
                    num_of_doctors: numberOfDoctor.rows[0].num_of_doctors,
                    upcoming_appointments: upcomingReservations.rows[0].upcoming_appointments,
                    last_week_appointments: lastWeekAppointments.rows[0].last_week_appointments,
                    last_month_appointments: lastMonthAppointments.rows[0].last_month_appointments,
                    medicine:mediciens
                }
            })
        } else {
            res.status(400).json({ status: httpStatusCodes.ERROR, msg: "error occured" })
        }
    } catch (err) {
        console.log(err)
    } finally {
        client.release()
    }
})

// done testing
// get all medicines in the store
app.get('/api/getAvalableMedicines', async (req, res) => {
    const client = await pool.connect()
    try {
        const mediciens = await client.query('select * from medicine')
        if (mediciens) {
            res.status(200).json({ status: httpStatusCodes.SUCCESS, data: mediciens.rows })
        } else {
            res.status(500).json({ status: httpStatusCodes.FAIL, msg: "no data was found" })
        }
    } catch (err) {
        console.log(err)
    } finally {
        client.release()
    }
})

// done testing
// get all scans avalable
app.get('/api/getAllScans', async (req, res) => {
    const client = await pool.connect()
    try {
        const scans = await client.query('select * from scan')
        if (scans) {
            res.status(200).json({ status: httpStatusCodes.SUCCESS, data: scans.rows })
        } else {
            res.status(500).json({ status: httpStatusCodes.FAIL, msg: "no data was found" })
        }
    } catch (err) {
        console.log(err)
    } finally {
        const client = await pool.connect()
    }
})

// done testing
// make a receipt

app.patch('/api/makeReceipt', async (req, res) => {
    const client = await pool.connect()
    try {
        const { patient_email, medicines, scans, insurance_discount_percentage } = req.body
        let totalCost = 0
        // mediciens check
        for (let i = 0; i < medicines.length; i++) {
            const medicienName = medicines[i].medicien_name
            const medicienQuantity = medicines[i].medicien_Quantity
            let avalableQuantity = await client.query(`select medicine_quantity, cost from medicine where medicine_name = '${medicienName}'`)
            if (avalableQuantity.rows.length) {
                let cost = avalableQuantity.rows[0].cost
                avalableQuantity = avalableQuantity.rows[0].medicine_quantity
                if (avalableQuantity >= medicienQuantity) {
                    console.log(totalCost, medicienQuantity, cost)
                    totalCost = totalCost + medicienQuantity * cost
                    continue
                } else {
                    res.status(400).json({ status: httpStatusCodes.FAIL, msg: `no enough ${medicienName} in the store` })
                    return
                }
            } else {
                res.status(400).json({ status: httpStatusCodes.FAIL, msg: `${medicienName} is not found` })
                return
            }
        }
        // sacns check
        for (let i = 0; i < scans.length; i++) {
            const scanName = scans[i].scan_name
            let existScan = await client.query(`select scan_id, cost from scan where scan_name = '${scanName}'`)
            if (existScan.rows.length) {
                totalCost = totalCost + existScan.rows[0].cost * scans[i].scan_Quantity
                continue
            } else {
                res.status(400).json({ status: httpStatusCodes.FAIL, msg: "this scan is not avalable in the hospital" })
                return
            }
        }
        let patientId = await client.query(`Select pid from patient where Email = '${patient_email}'`)
        let doctorId = await client.query(`select did from doctor where email = '${req.session.email}'`)
        if (patient_email) {
            if (req.session.email) {
                let patient_Id = patientId.rows[0].pid
                let doctor_Id = doctorId.rows[0].did
                await client.query(`insert into receipt(did, pid) values(${doctor_Id},${patient_Id})`)
                let receiptId = await client.query(`select receipt_id from receipt where pid = ${patient_Id} and did = ${doctor_Id} order by receipt_date desc, receipt_time desc`)
                receiptId = receiptId.rows[0].receipt_id
                for (let i = 0; i < medicines.length; i++) {
                    const medicienName = medicines[i].medicien_name
                    const medicienQuantity = medicines[i].medicien_Quantity
                    let avalableQuantity = await client.query(`select medicine_quantity from medicine where medicine_name = '${medicienName}'`)
                    avalableQuantity = avalableQuantity.rows[0].medicine_quantity

                    let newQuantity = avalableQuantity - medicienQuantity

                    let medicineId = await client.query(`select medicine_id from medicine where medicine_name = '${medicienName}'`)
                    medicineId = medicineId.rows[0].medicine_id

                    await client.query(`insert into contained_medicine(quantity, Medicine_ID, Receipt_ID) values(${medicienQuantity}, ${medicineId}, ${receiptId})`)
                    await client.query(`update medicine set medicine_quantity = ${newQuantity} where medicine_id =  ${medicineId} `)
                }
                for (let i = 0; i < scans.length; i++) {
                    const scanName = scans[i].scan_name
                    let scanId = await client.query(`select scan_id from scan where scan_name = '${scanName}'`)
                    scanId = scanId.rows[0].scan_id
                    await client.query(`insert into contained_scan(Receipt_ID, Scan_ID) values(${receiptId}, ${scanId})`)
                }
                totalCost = totalCost - totalCost * insurance_discount_percentage
                await client.query(`update receipt set total_cost = ${totalCost} where receipt_id = ${receiptId}`)
                res.status(200).json({ status: httpStatusCodes.SUCCESS, msg: `Receipt added successfuly, total cost = ${totalCost}` })
                return
            } else {
                res.status(400).json({ status: httpStatusCodes.FAIL, msg: "Session expired" })
                return
            }
        } else {
            res.status(400).json({ status: httpStatusCodes.FAIL, msg: "patient is not found" })
            return
        }
    } catch (err) {
        console.log(err)
    } finally {
        client.release()
    }
})

// done testing
// delete appointment
app.patch('/api/deleteAppointment', async (req, res) => {
    const client = await pool.connect()
    try {
        const { appointment_id } = req.body
        const patientEmail = req.session.email
        if (patientEmail) {
            await client.query(`update appointment set pid = NULL, status = 'Free' where appid = ${appointment_id} and date > current_date`)
            const testId = await client.query(`select * from appointment where appid = ${appointment_id}  and status = 'Reserved'`)
            if (testId.rows.length) {
                res.status(400).json({ status: httpStatusCodes.FAIL, msg: "you cannot delete a past appointment" })
            } else {
                res.status(200).json({ status: httpStatusCodes.SUCCESS, msg: "appointment deleted sucessfuly" })
            }
        } else {
            res.status(400).json({ status: httpStatusCodes.FAIL, msg: "session expired" })
        }
    } catch (err) {
        console.log(err)
    } finally {
        client.release()
    }
})

// done testing
// change password
app.patch('/api/changePassword', async (req, res) => {
    const client = await pool.connect()
    try {
        const { old_password, new_password, user_type } = req.body
        const currentEmail = req.session.email
        if (currentEmail) {
            if (user_type === "PATIENT") {
                if (old_password != new_password) {
                    const userId = await client.query(`select * from patient where email ='${currentEmail}' and password = '${old_password}'`)
                    if (userId.rows.length) {
                        await client.query(`update patient set password = '${new_password}' where email = '${currentEmail}'`)
                        res.status(200).json({ status: httpStatusCodes.SUCCESS, msg: "password updated succsessfully" })
                        return
                    } else {
                        res.status(500).json({ status: httpStatusCodes.FAIL, msg: "please enter the correct old password" })
                        return
                    }
                } else {
                    res.status(500).json({ status: httpStatusCodes.FAIL, msg: "do not enter the same password" })
                    return
                }
            } else if (user_type === "DOCTOR") {
                if (old_password != new_password) {
                    const userId = await client.query(`select did from doctor where email ='${currentEmail}' and password = '${old_password}'`)
                    console.log(userId)
                    if (userId.rows.length) {
                        await client.query(`update doctor set password = '${new_password}' where email = '${currentEmail}'`)
                        res.status(200).json({ status: httpStatusCodes.SUCCESS, msg: "password updated succsessfully" })
                        return
                    } else {
                        res.status(500).json({ status: httpStatusCodes.FAIL, msg: "please enter the correct old password" })
                        return
                    }
                } else {
                    res.status(500).json({ status: httpStatusCodes.FAIL, msg: "do not enter the same password" })
                    return
                }
            } else {
                res.status(500).json({ status: httpStatusCodes.FAIL, msg: "invalid user type" })
                return
            }
        } else {
            res.status(400).json({ status: httpStatusCodes.FAIL, msg: "Session expired" })
        }
    } catch (err) {
        console.log(err)
    } finally {
        client.release()
    }
})

// Done Testing
// logout 
app.get('/api/logout', (req, res) => {
    req.session.destroy(
        (err) => {
            if (err) {
                res.status(500).json({ status: httpStatusCodes.ERROR, msg: { err } })
                return
            }
            res.status(200).json({ status: httpStatusCodes.SUCCESS, msg: "Logged out Successfully" })
        }
    )
})


const storage2 = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'profilePhotos/') // save uploaded files to the 'uploads' directory
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // rename uploaded files
    }
});

const upload2 = multer({ storage: storage2 });

app.post('/profilePhoto', upload2.single('profilePic'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    const imageUrl = `http://localhost:4000/${req.file.path}`; // Get the URL of the uploaded image
    const client = await pool.connect()
    try {
        let email = req.session.email
        email_parts = email.split('@')
        if (email_parts[1] == "cardiodoc.com") {
            client.query(`update doctor set photo = '${imageUrl}' where email = '${email}'`)
            req.session.imageUrl = imageUrl
            res.send(imageUrl);
            return
        }
        client.query(`update patient set photo = '${imageUrl}' where email = '${email}'`)
        req.session.imageUrl = imageUrl
        res.send(imageUrl);
    }
    catch (err) {
        console.log(err)
    } finally {
        client.release()
    }

});

// Delete Doctor 
app.delete('/api/deleteDoctor', async (req, res) => {
    const client = await pool.connect();
    const { demail } = req.body;
    try {
        await client.query(`update doctor set isFired = True where email = '${demail}'`)
        res.status(200).json({ status: httpStatusCodes.SUCCESS, msg: "Doctor Fired Successfully" })
        //let doctorId = await client.query(`select did from doctor d where email ILIKE '%${email}%' and d.first_name ILIKE '%${fName}%' and d.last_name ILIKE '%${lName}%' `)
        // //working
        // await client.query(`DELETE FROM appointment p WHERE p.did = ${doctorId.rows[0].did}`)
        // await client.query(`DELETE FROM messages m WHERE m.did = ${doctorId.rows[0].did}`)
        // await client.query(`DELETE FROM receipt r WHERE r.did = ${doctorId.rows[0].did}`)
        // const report_id = await client.query(`SELECT r.report_id FROM report r WHERE r.did = ${doctorId.rows[0].did}`)
        // console.log(report_id)
        // for (var i = 0; i < report_id.rows.length; i++) {
        //     console.log(report_id.rows[i].report_id)
        //     await client.query(`DELETE FROM report_scans rs WHERE rs.report_id = ${report_id.rows[i].report_id}`)
        // }
        // await client.query(`DELETE FROM report re WHERE re.did = ${doctorId.rows[0].did}`)
        // // phones not working   
        // await client.query(`DELETE FROM doctor_phone_numbers ph WHERE ph.did = ${doctorId.rows[i].did}`)
        // await client.query(`DELETE FROM doctor d WHERE d.did = ${doctorId.rows[0].did}`)
        // if (result.rowCount > 0) {
        //     res.status(200).json({ status: 'SUCCESS', msg: 'Patient deleted successfully' });
        // } else {
        //     res.status(404).json({ status: 'ERROR', msg: 'Patient not found' });
        // }
    }
    catch (error) {
        console.log(error)
    }
})

const pdfUpload = multer()

app.post('/api/sendEmail', pdfUpload.single('pdf'), (req, res) => {
    const pdfBuffer = req.file.buffer;
    const dName = req.body.dName
    const pName = req.body.pName
    const time = req.body.time
    const date = req.body.date
    const pemail = req.body.pEmail
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'hisdoctor26@gmail.com',
            pass: 'youv ujpc rmre rcss'
        }
    });

    let mailOptions = {
        from: 'hisdoctor26@gmail.com',
        to: `${pemail}`,
        subject: 'Hospital Receipt',
        text: `Dear ${pName}
Kindly attached your Receipt for your latest appointment with ${dName}
${dName}`,
        attachments: [
            {
                filename: `Receipt ${pName} ${date} ${time}.pdf`,
                content: pdfBuffer
            }
        ]
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).json({error : error});
        }
        return res.status(200).json({msg :`Email sent:  + ${info.response}`});
    });
});


app.listen(4000, () => {
    console.log("Listening on Port 4000");
})

