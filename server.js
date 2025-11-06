import express from "express";
import bodyParser from "body-parser";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

const gemini_api_key = process.env.API_KEY;
const googleAI = new GoogleGenerativeAI(gemini_api_key);
const model = googleAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const chat = model.startChat({
  history: [
    {
      role: "user",
      parts: [{ text: "Hello, my mental health is really bad right now." }],
    },
    {
      role: "model",
      parts: [{ text: "sure, i can help you with it. " }],
    },
  ],
  generationConfig: {
    temperature: 1.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 350,
    responseMimeType: "text/plain",
  },
});

const app = express();
// Middleware
app.use(bodyParser.json());

// Store messages
let messages = [];
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/api/messages", async (req, res) => {
  try 
   { const { message } = req.body;
    messages.push({ text: message, sender: "user" });
    console.log(message);
    const result = await chat.sendMessage(message);
    res.status(200).json({ message: result.response.text().replaceAll("*","") });}
   catch(err){
    console.error(err)
    res.status(200).json({message:"I'm sorry i can't help you with that."})
   } // Process and store the message, you might want to associate it with a specific user
});

app.get("/api/messages", (req, res) => {
  // Return messages to the client
  res.json(messages);
});

// Start the server
const PORT = process.env.PORT || 80;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
