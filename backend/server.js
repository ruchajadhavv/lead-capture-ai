const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const registrationRoutes = require("./routes/registration");
const RegistrationModel = require("./models/Registration");
const { qualifyLead } = require("./Services/LeadQualifierService");

const app = express();

const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({ ok: true });
});

// Mongo-backed endpoint for React/Fetch: POST /api/lead
app.post("/api/lead", async (req, res) => {
  try {
    const { firstName, lastName, email, businessName, message } = req.body;

    if (!firstName || !lastName || !email || !businessName) {
      return res.status(400).json({ error: "Please fill in all required fields." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email address." });
    }

    // backend model requires message, so store empty string if UI doesn't send it
    const newRegistration = new RegistrationModel({
      firstName,
      lastName,
      email,
      businessName,
      message: message || "",
    });

    const saved = await newRegistration.save();

    // AI qualification + first email draft (non-blocking)
    try {
      const qualification = await qualifyLead(saved);
      saved.aiScore = qualification.aiScore;
      saved.aiScoreReason = qualification.aiScoreReason;
      saved.aiEmailDraft = qualification.aiEmailDraft;
      await saved.save();
    } catch (e) {
      console.error("AI qualification failed:", e?.message || e);
    }

    return res.status(201).json({
      success: true,
      message: "Lead submitted successfully!",
      lead: saved,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server Error" });
  }
});

// Mongo-backed endpoint for viewing leads: GET /api/leads
app.get("/api/leads", async (req, res) => {

  try {
    const leads = await RegistrationModel.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

// Mongo-backed endpoint (MongoDB route file): POST /api/register
app.use("/api/register", registrationRoutes);

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Backend running at http://localhost:${PORT}`);
  });
};

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});

