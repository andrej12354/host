const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;
const ACC_FILE = path.join(__dirname, 'accs.json');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname)); // Serve HTML files

// Ensure accs.json exists
if (!fs.existsSync(ACC_FILE)) {
    fs.writeFileSync(ACC_FILE, JSON.stringify([]));
}

// Helper to read accounts
function readAccounts() {
    return JSON.parse(fs.readFileSync(ACC_FILE, 'utf8'));
}

// Helper to save accounts
function saveAccounts(accounts) {
    fs.writeFileSync(ACC_FILE, JSON.stringify(accounts, null, 2));
}

// Signup endpoint
app.post('/signup', (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) return res.status(400).json({ message: 'Missing fields' });

    const accounts = readAccounts();
    if (accounts.find(a => a.email === email)) return res.status(400).json({ message: 'Email already exists' });

    accounts.push({ username, email, password });
    saveAccounts(accounts);
    res.json({ message: 'Account created' });
});

// Login endpoint
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing fields' });

    const accounts = readAccounts();
    const user = accounts.find(a => a.email === email && a.password === password);
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    res.json({ message: 'Login successful', username: user.username });
});

// Start server
app.listen(PORT, () => {
    console.log(`MineDime server running at http://localhost:${PORT}`);
});
