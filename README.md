# Flexify - Gym Management System

## Overview
**Flexify** is a modern, responsive Gym Management System built using **Next.js**, **React**, **TypeScript**, **Tailwind CSS**, and **Firebase**.  
It allows gym admins to manage members, classes, attendance, and basic settings, while regular users (gym members) can view their own schedules and attendance.

The system provides a clean dashboard with different access levels for **Admin** and **Normal Users**.

---

## Features

### Admin
- **Member Management**
  - Add, update, delete, and view gym members.
  - View member joined date and search/filter members.
- **Class Management**
  - Create, update, delete, and view gym classes/schedules.
  - Filter and sort classes by date and class name.
- **Attendance Management**
  - Mark attendance for all members.
  - Update, delete, and view attendance records.
  - Filter attendance by date.
- **Settings**
  - Change admin name.
  - Light/Dark mode toggle.
  - View and edit company information.
- **Support**
  - View support contact information (email, phone, location).

### Normal Users (Members)
- **View Only Access**
  - See list of members (read-only, cannot add/update/delete).
  - See class schedules.
  - View only their own attendance.
- **Settings**
  - Light/Dark mode toggle.
  - View company information.
- **Support**
  - View contact information.

---

## Tech Stack
- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Backend/Database:** Firebase Firestore
- **Authentication:** Firebase Authentication (Email/Password)
- **Hosting/Deployment:** Vercel
- **UI Components:** Shadcn/UI, Headless UI, Custom Components

---

## Firebase Configuration
The project uses Firebase for:
- **Authentication**: Email/password login for admins and users.
- **Firestore**: Stores `users`, `schedules`, and `attendances` collections.
- **Rules & Security**:
  - Admins have full read/write access.
  - Members can read members and schedules, but can only manage their own attendance.

---

## Installation & Setup

1. **Clone the repository**
    git clone https://github.com/Xquez/Flexify.git

2. Install dependencies
    npm install
    
3. Firebase Configuration
    Create a Firebase project.
    Enable Authentication (Email/Password).
    Create Firestore collections: users, schedules, attendances.
    Copy your Firebase config object into the project (e.g., src/firebase/config.ts):

    const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
    };


4. Run the project locally
    npm run dev
    Open http://localhost:3000 in your browser.

Deployment
    The project can be deployed to Vercel.
    Make sure to add your Firebase configuration as Environment Variables in Vercel:
        NEXT_PUBLIC_FIREBASE_API_KEY
        NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
        NEXT_PUBLIC_FIREBASE_PROJECT_ID
        NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
        NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
        NEXT_PUBLIC_FIREBASE_APP_ID

Usage
    Admin Login: Full control over members, classes, attendance, and settings.
    Member Login: View-only access with own attendance records.

Notes
    Dark/Light mode persists across sessions.
    Attendance and schedules are fully synchronized with Firebase Firestore.
    All sensitive admin actions are protected via Firebase Security Rules.

License
    This project is open source. Feel free to fork and customize.