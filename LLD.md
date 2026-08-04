# Low Level Design (LLD)

# Project

DoseWise AI

---

# Folder Structure

src/

components/

pages/

hooks/

services/

utils/

context/

assets/

App.tsx

main.tsx

---

# Authentication Flow

User enters credentials

↓

Frontend Validation

↓

Authentication API

↓

Credential Verification

↓

Session Creation

↓

Dashboard

---

# Protected Route Flow

User Request

↓

Authentication Check

↓

Token Validation

↓

Access Granted

↓

Dashboard

---

# Medication Flow

User

↓

Add Medication

↓

Validate Form

↓

API Request

↓

Store Data

↓

Dashboard Update

---

# Reminder Flow

User Creates Reminder

↓

Validate Input

↓

Save Reminder

↓

Notification Scheduled

↓

Reminder Displayed

---

# AI Flow

User Question

↓

Frontend

↓

AI Service

↓

Response Generation

↓

Display Response

---

# Component Responsibilities

Landing Page

- Marketing content
- CTA

Login Page

- Authentication

Dashboard

- Overview
- Navigation

Medication Page

- CRUD Operations

AI Assistant

- Chat Interface
- AI Requests

Profile

- User Information

Settings

- Preferences

---

# Error Handling

- Form Validation
- API Errors
- Authentication Errors
- Network Failures
- Empty States

---

# State Management

Application state includes:

- User Session
- Authentication Status
- Medication Data
- AI Responses
- Dashboard Information

---

# API Flow

Frontend

↓

HTTP Request

↓

Backend

↓

Business Logic

↓

Database

↓

Response

↓

Frontend Update

---

# Future Improvements

- Push Notifications
- Offline Support
- AI Recommendations
- OCR Prescription Upload
- Medicine Barcode Scanner