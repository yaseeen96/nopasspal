const express = require("express");
const OpenAI = require("openai");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const organizationId = process.env.ORGANIZATIONID;
const projectId = process.env.PROJECTID;

const openai = new OpenAI({
  organization: organizationId,
  project: projectId,
  apiKey: process.env.APIKEY,
});

app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

const emailSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  response: { type: String, required: true },
});

const Email = mongoose.model("Email", emailSchema);

app.post("/validator", async (req, res) => {
  const { password, email } = req.body;

  if (!password || !email) {
    return res.status(400).send("Password and email are required");
  }

  try {
    const messages = [
      {
        role: "system",
        content:
          "You are an assistant that generates dark humor and offensive validation messages for rejected passwords.",
      },
      {
        role: "user",
        content: `Reject the following password and respond with a dark humor and funny validation message that doesn't explicitly say 'password rejected.' The message should be a maximum of 12 words.\n\nPassword: ${password}`,
      },
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o-2024-05-13",
      messages: messages,
      max_tokens: 50,
      temperature: 0.8,
    });

    const validationMessage = response.choices[0].message.content.trim();

    // Save email, password, and response to the database
    const newEmail = new Email({
      email,
      password,
      response: validationMessage,
    });
    await newEmail.save();

    res.json({ message: validationMessage });
  } catch (error) {
    console.error("Error validating password:", error);
    res.status(500).send("Internal server error");
  }
});

// New GET endpoint to count emails
app.get("/email-count", async (req, res) => {
  try {
    const emailCount = await Email.countDocuments();
    res.json({ count: emailCount });
  } catch (error) {
    console.error("Error counting emails:", error);
    res.status(500).send("Internal server error");
  }
});

app.listen(port, function () {
  console.log(`Server is running on port ${port}`);
});
