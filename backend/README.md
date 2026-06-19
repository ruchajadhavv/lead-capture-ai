# lead-capture-ai backend

## Run

```bash
cd backend
npm install
npm run dev
```

Backend will start at:
- http://localhost:5000

## Endpoints

- `GET /api/health`
- `POST /api/lead` (JSON body: `firstName,lastName,email,businessName,message`)
- `GET /api/leads`
- `POST /api/register` (same body as `/api/lead`)

## AI Lead Qualification

After a lead is saved via `POST /api/lead`, the backend calls an AI model to:
- score the lead as `Hot`, `Warm`, or `Cold` (with a one-line reason)
- generate a personalized first-response email draft
- store `aiScore`, `aiScoreReason`, and `aiEmailDraft` on the lead document

### Environment variables
- `OPENAI_API_KEY` (required)
- `OPENAI_MODEL` (optional; defaults to `gpt-4o-mini`)

### Notes
- AI qualification is attempted in a try/catch block. If the AI call fails, the lead is still saved, but AI fields may be `null`.


## MongoDB (for Postman + Compass)

1. Set environment variable `MONGO_URI` before starting backend.
2. Example request (Postman):
   - **Method:** POST
   - **URL:** `http://localhost:5000/api/lead`
   - **Body (raw / JSON):**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "businessName": "Acme LLC",
  "message": "Interested in your service"
}
```

3. In **MongoDB Compass**, connect using the same `MONGO_URI`, then view the collection `registrations` (or check via the “Collections” tab after inserting one record).


