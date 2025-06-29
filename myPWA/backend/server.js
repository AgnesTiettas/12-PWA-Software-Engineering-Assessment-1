const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const bcrypt =require('bcrypt'); //For hashing the passwords

const app = express();
const port = 3001;
const saltRounds =10;


// Middleware
app.use(bodyParser.json()); 
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false })); 

app.use(express.static(path.join(__dirname, '../frontend')));


const AccountdbPath = path.join(__dirname, 'database', 'Account.db');
const Accountdb = new sqlite3.Database(AccountdbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Connected to SQLite database');
        Accountdb.run(`CREATE TABLE IF NOT EXISTS Users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            Username TEXT UNIQUE,
            Email TEXT,
            Password TEXT
        )`, (err) => {
            if (err) {
                console.error('Error creating Users table:', err.message);
            }else{
                console.log('Users table created')
            }
        });
    }
});

app.get('/', (req,res) => res.redirect('/login'));

app.get('/login', (req,res) => { 
    res.sendFile(path.join(__dirname,'../frontend/LoginandSignup.html'));
});
app.get('/register', (req, res) => {
      res.sendFile(path.join(__dirname,'../frontend/LoginandSignup.html'));

});
    

//Register Users 
app.post('/register', async(req,res) => {
    const { Username, Email, Password} = req.body;
    //Checking for exisiting username and email 
    Accountdb.get('SELECT * FROM Users WHERE Username=? OR Email =?', [Username, Email], async (err, row) => {
        if(err) {
            return res.status(500).send('Database Error');
        } 
        if (row) {
            if (row.Username=== Username) {
                return res.status(409).send('Username already exists, try again.');

            }else if (row.Email === Email) {
                return res.status(409).send('Email already exists.');
            }
        }

   

        const hashedPassword = await bcrypt.hash(Password, saltRounds); // Hashes using brcypt
        const Insertsql = `INSERT INTO Users(Username, Email, Password) Values(?,?,?)`; //Uses parametersied query to store User data
        Accountdb.run(Insertsql, [Username, Email, hashedPassword], (err) => {
            if(err) {
                return res.status(500).send('Error:' + err.message); // Error Handling
            } else {
                return res.send('User registered! ');
            }
        });
    });

});

   



//Login User
app.post('/login', async (req, res) => {
    const {Username, Password} =req.body;

    const sql = `SELECT * FROM Users WHERE Username=?`;
    Accountdb.get(sql, [Username], async (err, row) => {
        if (err) {
            console.error('Error' + err.message);
        }
        if (!row) {
            return res.status(404).send('User not found.');
        }
        const Passwordmatch =await bcrypt.compare(Password,row.Password);
        if (Passwordmatch) {
            res.send(`Welcome, ${Username}!`);
        } else{
            res.send('Incorrect Details');
        }
        
    });
});

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


