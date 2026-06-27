# 🌿 Rezonare — AI-Powered Mental Health Support Website

## 🧠 Overview
**Rezonare** is a web-based mental health support platform that uses AI to provide empathetic, informative, and personalized conversations to users seeking mental wellness support.

It's designed to help people express their feelings, receive calming responses, and access helpful mental health resources, all in a safe, private, and user-friendly environment.

The name *Rezonare* (derived from *resonate*) reflects the core mission: to create emotional resonance and connection between humans and technology.

---

## 💡 Features
- 🤖 **AI Chatbot** — Offers intelligent, empathetic responses to user queries about stress, anxiety, motivation, and mindfulness.
- 🔐 **Anonymous & Secure Chat** — Users can chat freely without sharing personal details.
- 🎨 **Clean & Calming UI** — Minimal, soothing design to enhance comfort and focus.
- 🌐 **Cross-Platform Compatibility** — Works seamlessly on both desktop and mobile browsers.

---

## 🧩 Tech Stack

| Category | Technology Used |
|-----------|-----------------|
| **Frontend** | HTML, CSS, JavaScript |
| **Backend** | Node.js, Express.js |
| **AI Integration** | Groq API (via `groq-sdk`, running Llama 3.3 70B) |
| **Deployment** | Render |

---

## 🚀 Getting Started

1. Clone the repo
   ```bash
   git clone https://github.com/Rup35h-05/Rezonare.git
   cd Rezonare
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up your environment variables
   - Copy `.env.example` to `.env`
   - Add your own Groq API key (get one at console.groq.com)
   ```bash
   cp .env.example .env
   ```

4. Run the server
   ```bash
   node server.js
   ```

5. Open `http://localhost:80` in your browser

---

## ⚠️ Security Note
Never commit your real `.env` file or API keys to version control. This repo's `.gitignore` already excludes `.env` — keep it that way.
