const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');


const app = express();
const port = 3001;


// Middleware
app.use(express.json()); // Use express.json() for parsing JSON bodies
app.use(cors());


// Set up SQLite database
const path = require('path');
const dbPath = path.join(__dirname, 'database', 'Watchlist_log.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Connected to SQLite database');
        db.run(`CREATE TABLE IF NOT EXISTS WatchlistMovie (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            Name TEXT,
            notes TEXT,
        )`);
    }
});


// Get a single watchlist_movie by ID
app.get('/api/Watchlist-Items/:id', (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM WatchlistMovie WHERE id = ?', [id], (err, row) => {
        if (err) {
            res.status(500).send('Error retrieving data');
        } else if (!row) {
            res.status(404).send('WatchlistMovie not found');
        } else {
            res.status(200).json(row);
        }
    });
});


// Create a new study session
app.post('/api/Watchlist-Items', (req, res) => {
    const { Name, notes } = req.body;
    db.run(`INSERT INTO WatchlistMovie (Name, notes) VALUES (?, ?)`,
        [Name, notes],
        function (err) {
            if (err) {
                res.status(500).send('Error inserting data');
            } else {
                res.status(201).json({ id: this.lastID });
            }
        });
});


// Get all study sessions
app.get('/api/study-sessions', (req, res) => {
    db.all('SELECT * FROM WatchlistMovie', [], (err, rows) => {
        if (err) {
            res.status(500).send('Error retrieving data');
        } else {
            res.status(200).json(rows);
        }
    });
});

app.delete('/api/study-sessions/:id', (req,res)=> {
    const {id}=req.params;
    db.run('DELETE FROM study_sessions WHERE id = ?', [id], function (err) {
        if (err) {
            res.status(500).send('Error deleting data');
        } else {
            res.status(200).json({ message: 'Study session deleted successfully' });
        }
    });

});


// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});


