const express = require("express");
const OpenAI = require("openai");
const dotenv = require("dotenv");
const cors = require("cors");

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

app.post("/validator", async (req, res) => {
  const password = req.body.password;

  if (!password) {
    return res.status(400).send("Password is required");
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

    res.json({ message: validationMessage });
  } catch (error) {
    console.error("Error validating password:", error);
    res.status(500).send("Internal server error");
  }
});

app.listen(port, function () {
  console.log(`Server is running on port ${port}`);
});
