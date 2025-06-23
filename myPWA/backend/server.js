const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3001;


// Middleware
app.use(bodyParser.json()); 
app.use(cors());





// Set up SQLite database

const dbPath = path.join(__dirname, 'database', 'Watchlist_log.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Connected to SQLite database');
        db.run(`CREATE TABLE IF NOT EXISTS Watchlist_Items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            priority TEXT,
            notes TEXT
        )`);
    }
});



// Get a single watchlist_movie by ID
app.get('/api/Watchlist-Items/:id', (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM Watchlist_Items WHERE id = ?', [id], (err, row) => {
        if (err) {
            res.status(500).send('Error retrieving data');
        } else if (!row) {
            res.status(404).send('Watchlist Items not found');
        } else {
            res.status(200).json(row);
        }
    });
});


// Create a new Watchlist Item
app.post('/api/Watchlist-Items', (req, res) => {
    const { name, priority, notes } = req.body;
    db.run(`INSERT INTO Watchlist_Items (Name, Priority, Notes) VALUES (?, ?, ?)`,
        [name, priority , notes],
        function (err) {
            if (err) {
                res.status(500).send('Error inserting data');
            } else {
                res.status(201).json({ id: this.lastID });
            }
        });
});


// Get all Watchlist Items
app.get('/api/Watchlist-Items', (req, res) => {
    db.all('SELECT * FROM Watchlist_Items', [], (err, rows) => {
        if (err) {
            res.status(500).send('Error retrieving data');
        } else {
            res.status(200).json(rows);
        }
    });
});



//Delete Watchlist Item
app.delete('/api/Watchlist-Items/:id', (req, res)=> {
    const { id } =req.params;
    db.run(`DELETE FROM Watchlist_Items WHERE id=?`, id, 
        function (err){
            if (err) {
                res.status(500).send('Error deleting data');  
            }else{
                res.status(200).send('Deleted successfully');
            }

        });
});


//Update Watchlist Item
app.put('/api/Watchlist-Items/:id', (req, res) => {
    const { id } = req.params; 
    const {name, priority, notes} = req.body; 
    db.run(`UPDATE Watchlist_Items SET Name = ?, Priority = ?, Notes = ? WHERE id = ?`, 
        [name, priority, notes, id], 
        function (err) {
            if(err) {
                res.status(500).send('Error in updating the data'); 
            }else {
                res.status(200).send('Updated successfully');

            }
        });
    
});


// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

