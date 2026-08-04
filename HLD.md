# High Level Design (HLD)

# Project

DoseWise AI

---

# Architecture Overview

User

↓

Frontend (React)

↓

Authentication Layer

↓

Application Services

↓

AI Service

↓

Database

---

# Major Components

## Frontend

Responsibilities:

- User Interface
- Routing
- Forms
- Dashboard
- Authentication Pages

---

## Authentication

Responsibilities:

- Login
- Signup
- Session Management
- Protected Routes

---

## Dashboard

Responsibilities:

- Display user information
- Medication overview
- Navigation

---

## Medication Module

Responsibilities:

- CRUD Operations
- Reminder Management
- Medication Records

---

## AI Module

Responsibilities:

- Medicine Queries
- AI Responses
- Health Guidance

---

## Backend/API Layer

Responsibilities:

- Business Logic
- Data Validation
- Authentication
- API Responses

---

## Database

Stores:

- Users
- Medications
- Reminder Data
- User Preferences

---

# High-Level Data Flow

User

↓

Frontend

↓

API

↓

Authentication

↓

Business Logic

↓

Database

↓

Response

↓

Frontend

---

# Security

- Secure Authentication
- Route Protection
- Input Validation
- Secure API Communication

---

# Deployment

Developer

↓

GitHub

↓

Vercel

↓

Production Website

---

# Scalability

The architecture supports:

- AI expansion
- Multiple APIs
- More dashboard modules
- Notification services
- Mobile applications