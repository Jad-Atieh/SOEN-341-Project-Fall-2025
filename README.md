# SOEN-341-Project-Fall-2025

## Objective
Develop a program for managing, promoting, and attending campus events.

## Team Members
- Jaad Atieh (40273022) — Jad-Atieh  
- Jacob Martins (40282562) — Jackk-0  
- Tala Karraz (40297514) — talakarraz  
- Thanusan Kanagasingam (40248590) — thanusan11  
- Suheil Almouhassel (40285426) — suheil2004  
- Harshitaa Yogesh Nandgaonkar (40193642) — hnandga
- Jakson Rabinovitch (40285726) — jaksonrab  
- Denise Balaba (40246058) — denise-com  

## Project Description & Core Features
This project is a web application that assists students to create, look for, and go to events in their university. Organizers will be able to post and handle events as well as to check its attendance and analytics. Students can search for, register for and save events. They can also claim their tickets and check in with QR codes. Administrators can also moderate and manage organizations. 

## Programming Languages & Techniques
- Django
- Python
- JavaScript
- React
- HTML
- CSS

## Block Diagram
<img width="4073" height="970" alt="Block_Diagram_SOEN341_" src="https://github.com/user-attachments/assets/c5d872a6-c0f1-4db4-b25a-214abe60bd28" />


## Installation Guide
Follow the steps below to set up the project on your local machine.

**1. Clone the repository**

Open your terminal and run:

```bash
git clone <REPOSITORY_URL>
```

Replace `<REPOSITORY_URL>` with the GitHub HTTPS:

```bash
git clone https://github.com/Jad-Atieh/SOEN-341-Project-Fall-2025.git
```

Then navigate into the project folder:

```bash
cd <repository-folder>
```
or

```bash
cd SOEN-341-Project-Fall-2025
```

**2. Open the project**

Open the project folder in your preferred IDE (VSCode, PyCharm, etc.).

**3. Set up the backend (Django)**

Create a virtual environment:

```bash
python3 -m venv venv
```

Activate the virtual environment:

*Mac/Linux:*

```bash
source venv/bin/activate
```

*Windows:*

```bash
venv\Scripts\activate
```

**4. Install backend dependencies**

With the virtual environment active:

```bash
pip install -r requirements.txt
```
 **5. Create the MySQL Database**

Set up MySQL manually or using XAMPP, then create a database named:

```
soen341
```

> Ensure your MySQL username/password match the Django settings in `backend/settings.py`.

**6. Navigate to the backend**

```bash
cd backend
```

 **7. Apply migrations**

```bash
python manage.py makemigrations
python manage.py migrate
```

**8. Create an Admin User**

```bash
python manage.py createsuperuser
```

Follow the prompts to set up your admin account.

**9. Start the Django backend server**

```bash
python manage.py runserver
```

Backend will run at:

```
http://127.0.0.1:8000/
```

**10. Set up the frontend (React + Vite)**

Open a new terminal tab/window, then navigate to the frontend:

```bash
cd ..
cd frontend
```

Install frontend dependencies:

```bash
npm install
npm install react react-dom react-router-dom
npm install axios jwt-decode
```

> The first `npm install` should install everything from `package.json`, but extra installs are safe in case packages are missing.

**11. Start the frontend dev server**

```bash
npm run dev
```

Open the link shown in the terminal, typically:

```
http://localhost:5173/
```

You can now develop, test, and explore the application.

