import express from "express";
import bodyParser from "body-parser";
import Groq from "groq-sdk"; // Switched from Google SDK
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

// 1. Initialize Groq
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const app = express();
app.use(bodyParser.json());

// 2. Chat History - Groq uses a simple array of objects
let chatHistory = [
  {
    role: "user",
    content: "Hello, my mental health is really bad right now.",
  },
  {
    role: "assistant",
    content:
      "Sure, I can help you with that. Please tell me what's on your mind.",
  },
];

let messages = []; // For your local log

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE",
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type",
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/api/messages", async (req, res) => {
  try {
    const { message } = req.body;
    messages.push({ text: message, sender: "user" });

    // Add user message to history
    chatHistory.push({ role: "user", content: message });

    // 3. Call Groq API
    const completion = await groq.chat.completions.create({
      messages: chatHistory,
      model: "llama-3.3-70b-versatile", // High-performance alternative to Gemini Flash
      temperature: 0.2, // Lowered from 1.8 for better stability in mental health context
      max_tokens: 350,
      top_p: 1,
      stream: false,
    });   

    const responseText = completion.choices[0].message.content;

    // Add model response to history for context
    chatHistory.push({ role: "assistant", content: responseText });

    res.status(200).json({
      message: responseText.replaceAll("*", ""),
    });
  } catch (err) {
    console.error("Groq Error:", err);
    res
      .status(200)
      .json({ message: "I'm sorry, I'm having trouble connecting right now." });
  }
});

app.get("/api/messages", (req, res) => {
  res.json(messages);
});

const PORT = process.env.PORT || 80;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
