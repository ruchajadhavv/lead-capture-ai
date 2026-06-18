# Lead Capture AI (React + Node + MongoDB)

A simple lead-capture web app:
- **React frontend** collects lead details.
- **Express backend** validates and stores leads in **MongoDB**.
- After saving a lead, the backend uses an **LLM** to qualify the lead (*Hot/Warm/Cold*), generate a **one-line reason**, and draft a **personalized first-response email**.
- An **admin page** lists submitted leads along with AI results.

---

## Project Structure

```text
lead-capture-ai/
  README.md
  package.json                    # React frontend
  public/index.html

  src/
    App.js                        # Path-based routing: /admin or form
    index.js
    App.css
    index.css
    Components/
      Registration.jsx           # Re-export wrapper
      RegistrationForm.jsx      # Lead form (submits to /api/lead)
      AdminLeads.jsx            # Admin table/grid of leads
      Dashboard.jsx             # Dashboard stats (used by dashboard API)

  backend/
    README.md
    package.json                 # Backend dependencies
    server.js                   # Express entry
    config/db.js                # Mongo connection
    models/Registration.js     # Mongo model
    routes/registration.js     # POST /api/register (separate)

    Api/
      leadapi.js                # POST /api/lead client wrapper
      dashboardapi.js           # GET /api/dashboard/stats client wrapper

    Services/
      LeadQualifierService.js  # OpenAI qualification logic
      WhatsappService.js       # WhatsApp helper (present)
```

---

## Prerequisites

- Node.js (recommended **18+**)
- MongoDB
- OpenAI API key (optional; without it, AI qualification degrades gracefully)

---

## How to Run

### 1) Start MongoDB
Set `MONGO_URI` if needed. Otherwise backend defaults to:

- `mongodb://127.0.0.1:27017/lead-captur-ai`

### 2) Start Backend (Express)
From repo root:

```bash
cd backend
npm install
npm run dev
```

Backend runs at:
- **http://localhost:5000**

### 3) Start Frontend (React)
From repo root:

```bash
npm install
npm start
```

Frontend typically runs at:
- **http://localhost:3000**

---

## Environment Variables

### Backend (`backend/`)

- `MONGO_URI` (optional)
  - MongoDB connection string.

- `OPENAI_API_KEY` (optional)
  - If not set, leads are still saved, but AI results default to **Warm** with a reason about missing configuration.

- `OPENAI_MODEL` (optional)
  - Defaults to `gpt-4o-mini`.

### WhatsApp helper (present in code, not required for core flow)
`backend/Services/WhatsappService.js` expects:
- `PHONE_NUMBER_ID`
- `ADMIN_PHONE`
- `WHATSAPP_TOKEN`

---

## Backend API

Base URL:
- `http://localhost:5000/api`

### Health
- `GET /api/health`
  - Response: `{ ok: true }`

### Submit lead
- `POST /api/lead`
- Request body JSON:

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "businessName": "Acme LLC",
  "message": "Interested in your service"
}
```

**Validation**
- `firstName`, `lastName`, `email`, `businessName` required
- `email` must match a basic email regex

**Behavior**
1. Lead is saved to MongoDB (`Registration` collection/model)
2. AI qualification is attempted (non-blocking; try/catch)
3. Response returns the saved lead

### List leads (admin)
- `GET /api/leads`
  - Returns all leads sorted by newest first.

### Dashboard stats
- `GET /api/dashboard/stats`
  - Used by `src/Components/Dashboard.jsx`.

### Alternative registration route (separate from `/api/lead`)
- `POST /api/register`
  - Implemented in `backend/routes/registration.js`.
  - Keeps the same schema style (message defaults to empty string).

---

## AI Lead Qualification

Implemented in:
- `backend/Services/LeadQualifierService.js`

The service:
1. Builds a prompt using saved lead fields.
2. Calls OpenAI to generate output as **valid JSON only**:
   - `aiScore`: `Hot | Warm | Cold`
   - `aiScoreReason`: one line
   - `aiEmailDraft`: personalized email draft
3. Parses the returned JSON (includes a fallback to salvage JSON from extra text).
4. Normalizes the score to one of the allowed enum values.

If AI fails, the lead remains saved, but AI fields may be `null`.

---

## Frontend

### App entry + routing
- `src/App.js`
- Routing is **path-based** (no React Router):
  - If path starts with `/admin` → `AdminLeads`
  - Otherwise → `RegistrationForm`

### Lead submission form
- `src/Components/RegistrationForm.jsx`
- Submits via `fetch` to:
  - `http://localhost:5000/api/lead`

On success:
- shows an alert
- navigates to `/admin`

### Admin leads view
- `src/Components/AdminLeads.jsx`
- Fetches:
  - `http://localhost:5000/api/leads`
- Displays:
  - lead name + business
  - AI score badge
  - AI reason
  - AI email draft (inside a `<pre>` block)

---

## Development Scripts

- Frontend:
  - `npm start` / `npm run build` (in `lead-capture-ai/`)
- Backend:
  - `npm run dev` (in `lead-capture-ai/backend/`)

---



