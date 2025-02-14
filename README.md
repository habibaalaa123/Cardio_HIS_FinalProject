# Cardio - Hospital Information System Web Application

## Overview
This project is a web application designed to simulate a **Hospital Information System (HIS)** for the **Cardiology Department**. The system allows different user categories, such as **Doctors, Patients, and Administrators**, to access relevant functionalities. The project is built using:

- **Backend:** Node.js, Express.js
- **Frontend:** HTML, CSS, Bootstrap
- **Database:** PostgreSQL

## Features
### Core Functionalities
- **Home Page:** Landing page for visitors with an overview of the hospital system.
- **User Management:** Secure registration and login for different user types (Doctors, Patients, Admins, etc.).
- **Profile Management:** Each user has a personal profile (e.g., doctor profiles, patient medical history).
- **File Handling:** Upload and serve static files (e.g., patient scans and reports).
- **Appointments System:** Patients can book appointments with doctors.
- **Admin Dashboard:** Statistical analysis dashboard for administrators.
- **Responsive Design:** Built with Bootstrap for optimal mobile and desktop experience.
- **Contact Forms:** Inquiry forms for user communication.

### New Feature: Medication Billing System
- **Medication Stock Database:** Tracks available medications in the hospital's inventory.
- **Billing System:** Allows doctors and pharmacists to generate bills for prescribed medications.
- **Invoice Generation:** Generates printable bills for patients purchasing medications.
- **Stock Management:** Updates inventory after medication sales.
- **Integration with Patient Records:** Links prescribed medications to patient profiles.

## Installation & Setup
### Prerequisites
Ensure you have the following installed:
- Node.js
- PostgreSQL
- Git

### Steps to Run the Project
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/cardio-hospital-system.git
   cd cardio-hospital-system
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure database settings in `.env`:
   ```plaintext
   DB_HOST=your_database_host
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_NAME=your_database_name
   ```
4. Initialize the database:
   ```bash
   npm run db:init
   ```
5. Start the application:
   ```bash
   npm start
   ```
6. Access the application in the browser at `http://localhost:3000`

---

## Team Members
<div align="center">
  <table style="border-collapse: collapse; border: none;">
    <tr>
      <td align="center" style="border: none;">
        <img src="https://avatars.githubusercontent.com/Mostafaali3" alt="Mostafa Ali" width="150" height="150"><br>
        <a href="https://github.com/Mostafaali3"><b>Mostafa Ali</b></a>
      </td>
      <td align="center" style="border: none;">
        <img src="https://avatars.githubusercontent.com/habibaalaa123" alt="Habiba Alaa" width="150" height="150"><br>
        <a href="https://github.com/habibaalaa123"><b>Habiba Alaa</b></a>
      </td>
      <td align="center" style="border: none;">
        <img src="https://avatars.githubusercontent.com/Youssef-Abo-El-Ela" alt="Youssef abo-alela" width="150" height="150"><br>
        <a href="https://github.com/Youssef-Abo-El-Ela"><b>Youssef-Abo-El-Ela</b></a>
      </td>
      </td>
      <td align="center" style="border: none;">
        <img src="https://avatars.githubusercontent.com/JudyEssam" alt="Judy Essam" width="150" height="150"><br>
        <a href="https://github.com/JudyEssam"><b>Judy Essam</b></a>
      </td>
    <td align="center" style="border: none;">
        <img src="https://avatars.githubusercontent.com/Mayamohamed207" alt="Maya mohamed" width="150" height="150"><br>
        <a href="https://github.com/Mayamohamed207"><b>Maya mohamed</b></a>
      </td>
  </table>
</div>




---


## Screenshots & Videos
### Screenshots
(Insert screenshots of the website here)

### Video Demonstration
(Insert link to a demo video here)

## Contributing
1. Fork the repository
2. Create a new feature branch (`git checkout -b feature-name`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature-name`)
5. Open a Pull Request

## License
This project is licensed under the MIT License.

## Contact
For any inquiries, reach out via [your-email@example.com](mailto:your-email@example.com).

