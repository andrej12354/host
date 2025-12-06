const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); // serve HTML/CSS/JS from "public"

// Path to accs.json
const ACC_FILE = path.join(__dirname, "accs.json");

// Helper to load accounts
function loadAccounts() {
  if (!fs.existsSync(ACC_FILE)) return [];
  const data = fs.readFileSync(ACC_FILE);
  return JSON.parse(data);
}

// Helper to save accounts
function saveAccounts(accounts) {
  fs.writeFileSync(ACC_FILE, JSON.stringify(accounts, null, 2));
}

// Handle signup POST
app.post("/signup", (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).send("All fields are required!");
  }

  const accounts = loadAccounts();

  // Check if email exists
  if (accounts.some(acc => acc.email === email)) {
    return res.status(400).send("Email already registered!");
  }

  accounts.push({ username, email, password });
  saveAccounts(accounts);

  res.send("Account created successfully!");
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
