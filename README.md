# GYMKHANA: Smart Gym Management & Fitness Guide

> **College Field Project**  
> *A full-stack web application bridging athletic technique education with role-based fitness facility management.*

---

## 1. Project Overview & Academic Purpose

**GYMKHANA** is a dual-pillar web application engineered for small-to-medium athletic facilities and academic gym centers. Most fitness websites either become passive workout blogs without user management, or sterile administrative databases with zero educational guidance. GYMKHANA harmonizes both domains:

1. **Pillar A: Fitness Knowledge & Guidance (Public + Authenticated Members)**  
   A normalized, relational library containing 21+ anatomically categorized exercises, 12+ gym machines with adjustment guides and safety latches, 5+ periodized workout splits, and certified coaching profiles.
2. **Pillar B: Gym Management & Role Operations (Admin, Trainer, Member)**  
   Data-driven workflows for JWT session authentication, member onboarding, tier requests, attendance check-in/out tracking, biometric progress monitoring (weight, height, automatic BMI calculation), and full administrative CRUD control.

---

## 2. Technology Stack & Design Architecture

| Layer | Approved Technology | Rationale & Specifications |
| :--- | :--- | :--- |
| **Frontend** | React (Vite) | Clean ES6+ JavaScript, fast HMR, production build optimization |
| **Routing** | React Router DOM v6 | SPA client-side routing, protected routes, role guards, deep link support |
| **Styling** | Vanilla CSS Design System | Charcoal `#0F1115` base, `#171A21` surfaces, Electric Lime `#C6F135` accent |
| **API Client** | Axios | Interceptors for automated JWT injection and uniform response parsing |
| **Backend** | Node.js & Express.js | Modular REST API with structured controllers, routes, and middleware |
| **Database** | MySQL | Relational schema with foreign keys, indexes, and prepared statements |
| **Security** | bcryptjs & jsonwebtoken | 10-round salted password hashing; stateless signed JWT session tokens |
| **Deployment** | Vercel (SPA) + Cloud MySQL | Rewrites via `vercel.json` and serverless API entry in `backend/api/index.js` |

*No microservices, no third-party BaaS (Firebase, Supabase), no mock data illusions. All numbers and records come from MySQL.*

---

## 3. System Requirements

- **Node.js**: `v18.0.0` or higher (Tested on `v24.20.0`)
- **npm**: `v9.0.0` or higher (Tested on `v11.19.0`)
- **MySQL**: `5.0+` or `8.0+` / MariaDB (Tested with standard TCP port `3306`)

---

## 4. Local Installation & Setup Walkthrough

### Step 1: Clone or Navigate to Project
```bash
cd c:\Users\KRISHNA\Desktop\GYMKHANA
```

### Step 2: Database Initialization
Open your MySQL terminal or client (WAMP, XAMPP, or native MySQL command line) and run:
```bash
# Execute schema DDL
mysql -u root -p < database/schema.sql

# Execute seed data
mysql -u root -p < database/seed.sql
```
*Note: If your local root account has no password, omit `-p`.*

### Step 3: Backend Configuration & Start
```bash
cd backend

# Install dependencies (express, mysql2, bcryptjs, jsonwebtoken, cors, dotenv)
npm install

# Verify your .env matches your MySQL port and password:
# PORT=5000
# DB_HOST=localhost
# DB_PORT=3306
# DB_USER=root
# DB_PASSWORD=
# DB_NAME=gymkhana_db
# JWT_SECRET=gymkhana_super_secret_jwt_key_2026_field_project
# CORS_ORIGIN=http://localhost:5173

# Start the Express server
npm start
# Server listens on http://localhost:5000
```

### Step 4: Frontend Configuration & Start
Open a separate terminal:
```bash
cd frontend

# Install dependencies (react, react-dom, react-router-dom, axios, lucide-react)
npm install

# Start the Vite local server
npm run dev
# Frontend runs at http://localhost:5173
```

### Step 5: Open Browser
Navigate to **`http://localhost:5173`** to access the live application.

---

## 5. Database Architecture & Entity Relationships

The schema consists of 11 normalized tables with foreign keys:

```
[ users ] (Central Identity & Role Auth)
   ▲             ▲
   │ 1:1         │ 1:1
[ members ]   [ trainers ] (Author of workout plans)
   │  ▲          │  ▲
   │  │          │  │
   │  └──────────┼──┘ (Assigned Coach FK)
   │             │
   ├──▶ [ attendance ] (Check-in/out records)
   ├──▶ [ progress ]   (Biometric weight, height, BMI)
   │
   ▼ FK
[ memberships ] (Tier Durations, Rates, Privileges)

[ exercises ] ◀── FK ── [ equipment ] (Required facility machinery)
   ▲
   │ N:M junction
[ workout_plan_exercises ] ──▶ [ workout_plans ] (Goal, duration, split)

[ contact_messages ] (Public inquiries and member feedback)
```

### Table Dictionary
- `users`: Stores `id`, `full_name`, `email` (unique), `phone`, `password_hash`, `role` (`MEMBER`, `TRAINER`, `ADMIN`), timestamps.
- `members`: Linked 1:1 to `users`, contains `membership_id`, `trainer_id`, `join_date`, `status` (`ACTIVE`/`INACTIVE`).
- `trainers`: Linked 1:1 to `users`, stores `specialization`, `experience_years`, `bio`, `certifications`, `availability_status`.
- `memberships`: Catalog of tiers with `duration_months`, `price`, `features`, and `access_details`.
- `exercises`: 21+ exercises cataloging target `body_part`, `difficulty`, `instructions`, `benefits`, `safety_tips`, `common_mistakes`, `image_url`.
- `equipment`: 12+ machines detailing `category`, `target_body_part`, `primary_purpose`, `how_to_use`, `safety_instructions`.
- `workout_plans`: 5+ routines with `goal`, `difficulty`, `duration_weeks`, `created_by`.
- `workout_plan_exercises`: Prescribes `day_or_order`, `sets`, `reps`, `rest_seconds`, and `notes`.
- `attendance`: Date-stamped member check-in/out records with status.
- `progress`: Date-stamped biometric records with `weight_kg`, `height_cm`, `bmi`, and coaching notes.
- `contact_messages`: Public inquiries with `name`, `email`, `phone`, `subject`, `message`, `is_read`.

---

## 6. REST API Endpoints Overview

All endpoints follow uniform JSON envelopes:
- Success: `{ "success": true, "data": { ... }, "message": "optional" }`
- Error: `{ "success": false, "error": { "code": "STRING_CODE", "message": "Human readable" } }`

| Route | Method | Access | Description |
| :--- | :--- | :--- | :--- |
| `/api/auth/register` | `POST` | Public | Enrolls new member account (hashes password, defaults role to MEMBER) |
| `/api/auth/login` | `POST` | Public | Verifies bcrypt hash, signs and returns 7-day JWT token |
| `/api/auth/me` | `GET` | Bearer JWT | Validates session, returns current user & profile specifics |
| `/api/exercises` | `GET` | Public | Searchable and filterable exercise directory |
| `/api/exercises/:id` | `GET` | Public | Full exercise biomechanics, instructions, and related movements |
| `/api/exercises` | `POST / PUT / DELETE` | Admin | Full CRUD administration for exercise entries |
| `/api/equipment` | `GET` | Public | Machinery and station directory with category filters |
| `/api/equipment/:id` | `GET` | Public | Machine operating manual, seat adjustment, and safety latches |
| `/api/equipment` | `POST / PUT / DELETE` | Admin | Full CRUD administration for equipment inventory |
| `/api/workouts` | `GET` | Public | Filterable list of periodized programs with exercise counts |
| `/api/workouts/:id` | `GET` | Public | Daily breakdown of sets, reps, rest intervals, and exercise notes |
| `/api/workouts` | `POST / PUT / DELETE` | Trainer/Admin | Author and manage workout splits |
| `/api/trainers` | `GET` | Public | Coaching staff directory with credentials and availability |
| `/api/trainers/dashboard`| `GET` | Trainer | Coach statistics, athlete roster, authored routines |
| `/api/trainers/profile` | `GET / PUT` | Trainer | View and update coaching bio, experience, and availability |
| `/api/trainers/members` | `GET` | Trainer | Athletes assigned to the logged-in coach |
| `/api/trainers/members/:id`| `GET` | Trainer | Detailed athlete dossier (attendance logs + biometric trends) |
| `/api/trainers/members/:id/assign-plan`| `POST` | Trainer | Assigns workout split to athlete profile |
| `/api/trainers/members/:id/progress` | `POST` | Trainer | Records biometric measurement for assigned athlete |
| `/api/members/dashboard`| `GET` | Member | Active tier, assigned coach, today's plan, recent check-ins |
| `/api/members/membership`| `GET` | Member | Current plan duration, privileges, and request status |
| `/api/members/workout-plan`| `GET` | Member | Assigned workout routine and scheduled exercises |
| `/api/members/attendance`| `GET` | Member | Attendance history filterable by month |
| `/api/members/progress` | `GET / POST` | Member | View progress history / record self-weigh-in and height (auto BMI) |
| `/api/memberships` | `GET` | Public | Active membership access tiers and prices |
| `/api/memberships/request`| `POST` | Member | Submits tier request to gym administration |
| `/api/memberships` | `POST / PUT / DELETE`| Admin | Create, update, or remove membership tiers |
| `/api/admin/stats` | `GET` | Admin | Live MySQL counts (members, coaches, machines, exercises, messages) |
| `/api/admin/members` | `GET / PUT` | Admin | Member directory, status toggle (Active/Inactive), tier change |
| `/api/admin/trainers` | `GET / PUT` | Admin | Staff management, capacity monitoring, profile editing |
| `/api/attendance` | `GET / POST` | Admin/Trainer | System-wide attendance log / manual floor check-in entry |
| `/api/contact` | `POST` | Public | Transmits inquiry to MySQL with input validation |
| `/api/contact` | `GET / PUT / DELETE` | Admin | View messages, mark read/unread, delete inquiries |

---

## 7. Frontend Feature Matrix & User Roles

### A. Public Visitors (No Login Required)
- **Home**: Hero banner, value proposition, live preview cards of exercise library, equipment catalog, featured workout splits, coaching highlights, and membership comparison.
- **About**: Honest documentation of project purpose as a college field project, explaining both pillars, relational data integrity, and tech choices.
- **Exercises Directory & Detail**: Real-time keyword search, filter by 7 muscle groups and 3 difficulty levels, order by name/difficulty. Detail page renders step-by-step phases, hypertrophy benefits, safety alignment, common flaws, and related exercises.
- **Equipment Directory & Detail**: Machinery search, filter by machine category and target area. Detail page provides operational seat adjustments, mechanical benefits, and safety lock instructions.
- **Workout Plans & Detail**: Filter by primary goal (Muscle Building, Strength, Weight Loss, General Fitness). Detail page formats multi-day splits with ordered tables (exercise, sets, reps, rest interval, execution notes).
- **Trainers**: Coaching directory with qualifications, years of experience, and inquiry links.
- **Membership**: Tier comparison (Basic, Standard, Elite) with duration, price, and included amenities.
- **Contact**: Validated contact form writing directly into the database.
- **Authentication**: Sign in with demo credential autofill; new member registration with client-side & server-side validation.

### B. Member Workspace (`/member`)
- **Dashboard**: Personalized welcome, membership status badge, assigned floor coach, prescribed routine, recent check-in table, and latest BMI score.
- **My Profile**: Update legal name, contact phone, and change password securely.
- **My Membership**: Review tier expiration, included privileges, and request tier upgrades.
- **My Workout Plan**: Full prescribed routine ordered by day/session.
- **My Attendance**: Chronological list of check-in and check-out timestamps with month-by-month filtering.
- **My Progress**: Longitudinal weight logs, height records, automatically calculated BMI category badge (Normal, Overweight, etc.), and coaching notes. Includes an interactive modal to log new measurements.
- **Feedback Desk**: Send direct notes and equipment requests to gym administration.

### C. Trainer Workspace (`/trainer`)
- **Dashboard**: Active athlete roster count, authored plan count, floor availability toggle.
- **Coach Profile**: Edit professional credentials, biography, and experience.
- **Assigned Athletes**: Searchable roster of members. Clicking an athlete opens their complete dossier: attendance logs, historical biometrics, and allows assigning workout plans or recording fresh progress measurements.
- **Author Plans**: Create, edit, and manage periodized routines.

### D. Administrator Workspace (`/admin`)
- **Dashboard**: Live relational statistics queried from MySQL (total members, active coaches, exercises, machines, plans, unread messages). Recent enrollments table and recent inquiries feed.
- **Members**: Complete member roster. Ability to activate/deactivate accounts, change membership tier, or reassign floor trainers.
- **Trainers**: Manage coach profiles and monitor client capacity.
- **Exercises**: Full CRUD modal interface to add new exercises with instructions, safety tips, and muscle targets.
- **Equipment**: Full CRUD modal interface to catalog gym apparatus and safety guides.
- **Workout Plans**: Full CRUD to structure routines and assign coaching authors.
- **Membership Tiers**: Configure membership duration, pricing, and features.
- **Attendance**: Global log of facility check-ins with date filtering and manual check-in entry.
- **Inquiries**: Review messages from the public and member feedback, toggle read status, and delete records.

---

## 8. Deployment Guide (Vercel + Cloud MySQL)

The repository was structured for deployment from day one without hardcoding `localhost`.

### 1. Cloud MySQL Database
1. Provision a managed MySQL instance on **Aiven**, **PlanetScale**, **Railway**, or **Clever Cloud**.
2. Run `database/schema.sql` followed by `database/seed.sql` on the cloud database.

### 2. Backend Deployment (Render / Railway / Serverless)
1. Deploy the `backend/` folder to your chosen host.
2. Configure host environment variables:
   - `DB_HOST`: Hostname of cloud MySQL
   - `DB_PORT`: `3306`
   - `DB_USER`: Database username
   - `DB_PASSWORD`: Database password
   - `DB_NAME`: `gymkhana_db`
   - `JWT_SECRET`: A secure 32+ character random string
   - `CORS_ORIGIN`: Your deployed Vercel frontend URL (e.g. `https://gymkhana.vercel.app`)
   - `PORT`: Managed by host (default `5000`)
3. Verify deployment: visit `https://<backend-url>/api/health`.

### 3. Frontend Deployment (Vercel)
1. In Vercel, import the repository and set Root Directory to `frontend`.
2. Configure Environment Variable:
   - `VITE_API_URL`: `https://<backend-url>/api`
3. Build Command: `npm run build` (Output Directory: `dist`).
4. The included `frontend/vercel.json` automatically rewrites all routes to `/index.html`, ensuring deep links (`/exercises/2`, `/dashboard`, etc.) do not 404 on refresh.

---

## 9. Assumptions & Known Limitations

1. **Payment Processing**: This academic field project intentionally does not simulate or pretend to process real credit card payments via Stripe/Razorpay. Membership tier selection submits an enrollment request to the database, where the administrator verifies and activates the membership.
2. **Session Storage**: JWT tokens are stored in `localStorage` for seamless browser persistence across tab reloads. For high-stakes enterprise banking applications, HTTP-only Secure cookies with CSRF tokens would be preferred.
3. **Database Compatibility**: The SQL schema avoids newer proprietary MySQL 8.0-only constructs (like native `JSON` columns), using standard `TEXT` fields so it remains backwards-compatible with older college lab servers (MySQL 5.0 - 5.7) as well as modern MySQL 8.x.

---

## 10. Common Troubleshooting

| Issue | Cause | Solution |
| :--- | :--- | :--- |
| `ECONNREFUSED 127.0.0.1:3306` | MySQL service is stopped or port is blocked | Start your local MySQL service (WampServer/XAMPP/MySQL) and confirm port `3306` is listening. |
| `CORS Error in Browser` | Origin mismatch between frontend and backend | Ensure `CORS_ORIGIN` in `backend/.env` contains your frontend address (`http://localhost:5173`). |
| `404 on Page Refresh in Production` | Single-Page Application routing rewrite missing | Ensure `frontend/vercel.json` exists with the rewrite rule pointing to `/index.html`. |
| `Invalid Token / 401 Unauthorized` | JWT expired or secret changed | Clear your browser's `localStorage` (`localStorage.removeItem('gymkhana_token')`) and log in again. |

---

## 11. Verification & Automated Test Results

The backend contains an automated regression test script (`backend/test-e2e.js`) validating all 36 core API interactions:
```bash
cd backend
node test-e2e.js
```
**Test Result: 36/36 tests passed (100.0% pass rate).**

```
====================================================
 SUMMARY: 36/36 TESTS PASSED (100.0%)
====================================================
```

---

*Authored for Academic Field Project & Viva Evaluation.*
