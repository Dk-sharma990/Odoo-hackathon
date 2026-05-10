const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// Database Setup
const db = new sqlite3.Database('./traveloop.db', (err) => {
    if (err) console.error(err.message);
    else {
        console.log('Connected to SQLite database.');
        
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT UNIQUE,
            password TEXT
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS trips (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            trip_type TEXT,
            name TEXT,
            start_date TEXT,
            end_date TEXT,
            description TEXT
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS trip_places (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            trip_id INTEGER,
            place_name TEXT,
            price TEXT,
            FOREIGN KEY(trip_id) REFERENCES trips(id)
        )`);
    }
});

// API Routes
app.post('/api/signup', (req, res) => {
    const { name, email, password } = req.body;
    db.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, password], function(err) {
        if (err) {
            return res.status(400).json({ error: 'Email already exists or error occurred.' });
        }
        res.json({ id: this.lastID, name, email });
    });
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    db.get('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (err, row) => {
        if (err || !row) return res.status(401).json({ error: 'Invalid credentials' });
        res.json({ id: row.id, name: row.name, email: row.email });
    });
});

app.post('/api/reset-password', (req, res) => {
    const { email, newPassword } = req.body;
    db.run('UPDATE users SET password = ? WHERE email = ?', [newPassword, email], function(err) {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (this.changes === 0) return res.status(404).json({ error: 'Email not found' });
        res.json({ message: 'Password reset successfully' });
    });
});

app.post('/api/trips', (req, res) => {
    const { user_id, trip_type, name, start_date, end_date, description } = req.body;
    db.run('INSERT INTO trips (user_id, trip_type, name, start_date, end_date, description) VALUES (?, ?, ?, ?, ?, ?)',
        [user_id, trip_type, name, start_date, end_date, description], function(err) {
            if (err) return res.status(500).json({ error: 'Failed to save trip' });
            res.json({ id: this.lastID, message: 'Trip saved successfully' });
        });
});

app.get('/api/trips', (req, res) => {
    const { user_id } = req.query;
    db.all('SELECT * FROM trips WHERE user_id = ?', [user_id], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Failed to fetch trips' });
        res.json(rows);
    });
});

app.post('/api/trip-places', (req, res) => {
    const { trip_id, place_name, price } = req.body;
    db.run('INSERT INTO trip_places (trip_id, place_name, price) VALUES (?, ?, ?)',
        [trip_id, place_name, price], function(err) {
            if (err) return res.status(500).json({ error: 'Failed to save place' });
            res.json({ id: this.lastID, message: 'Place saved to trip successfully' });
        });
});

app.get('/api/trip-places/:trip_id', (req, res) => {
    const trip_id = req.params.trip_id;
    db.all('SELECT * FROM trip_places WHERE trip_id = ?', [trip_id], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Failed to fetch places' });
        res.json(rows);
    });
});

// Fallback to index.html for SPA routing
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
