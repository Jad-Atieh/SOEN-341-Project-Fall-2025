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
- TBD

## Block Diagram
'''mermaid
flowchart TD

%% ========= LAYER 1: USERS =========
subgraph USERS[Users]
direction TB
    STU[Student]
    ORG[Organizer]
    ADM[Admin]
end


%% ========= LAYER 2: AUTH =============
subgraph AUTH[Authentication JWT]
direction TB
    AUTHAPI[Login / Register API]
end

STU --> AUTHAPI
ORG --> AUTHAPI
ADM --> AUTHAPI


%% ========= LAYER 3: EVENT MANAGEMENT =========
subgraph EVENTS[Event Management]
direction TB
    VE[View Events<br/>GET /events]
    CE[Create Event<br/>POST /events]
    UE[Update/Delete Event<br/>PUT /events/:id]
end

AUTHAPI --> VE
AUTHAPI --> CE
AUTHAPI --> UE

ORG --> CE
ORG --> UE
STU --> VE
ADM -->|Approve/Reject| CE


%% ========= LAYER 4: STUDENT TICKETS =========
subgraph STUDENT_FLOW[Student Ticket Flow]
direction TB
    SD[Student Dashboard<br/>GET /dashboard/student]
    CT[Claim Ticket<br/>POST /tickets/claim]
    MT[My Tickets<br/>GET /tickets/mine]
    TS[TicketSerializer<br/>Returns QR Code]
end

STU --> SD
STU --> CT
STU --> MT

MT --> TS
CT -->|Creates Ticket + QR| TBL1


%% ========= LAYER 5: ORGANIZER =========
subgraph ORG_FLOW[Organizer Dashboard]
direction TB
    OD[Organizer Dashboard<br/>GET /dashboard/organizer]
end

ORG --> OD


%% ========= LAYER 6: CHECK-IN =========
subgraph CHECKIN[QR Check-in Flow]
direction TB
    SCAN[Scanner App]
    CHECKINAPI[Check-in API<br/>POST /checkin]
end

SCAN --> CHECKINAPI
CHECKINAPI -->|Validate Ticket| TBL1
CHECKINAPI -->|Check-in Result| SCAN


%% ========= LAYER 7: DATABASE =========
subgraph DATABASE[Database Tables]
direction TB
end
'''
