let isEditMode = false; 
let editID = null; 

//Enables a Movie to added to the watchlist 
function addWatchlistItem(event) {
    event.preventDefault();

    const name = document.getElementById('Movie_Name').value; 
    const priority =document.getElementById('Priority').value;
    const notes= document.getElementById('Add_Note').value; 

    if (name && priority && notes) {
        if(!isEditMode) {
            fetch('http://localhost:3001/api/Watchlist-Items', {
                method:'POST',
                headers: { 
                    'Content-Type': 'application/json', 
                },
                body:JSON.stringify({name, priority, notes}),
            })
            .then(response => response.json())
            .then(data => { 
                console.log('Added to watchlist:', data);
                loadWatchlistItem();
                Form.reset();
                switchToAdd();
            })
            .catch (error => { 
                console.error('Error:', error);
            });
        } else {
            updateWatchlistItem(event);
        }    
    } else {
        alert('please fill in all required fields.');
    }
}

function switchToAdd() {
    isEditMode=false;
    editID=null;
    document.querySelector('button[type="submit"]').textContent="Add to Watchlist";
    document.getElementById('Form').reset();
}

function switchToEdit() {
    isEditMode=true;
    document.querySelector('button[type="submit"]').textContent="Update Movie";
    
}

//Function to load all items from the watchlist 

function loadWatchlistItem() {
    fetch('http://localhost:3001/api/Watchlist-Items')
        .then(response => response.json())
        .then(data => {
            const movieList = document.getElementById ('Movielist');
            movieList.innerHTML ='';
            data.forEach(item => {
                const Movie_item = document.createElement('div');
                Movie_item.className= 'Movie-item';

                // Showcases the sections within the watchlist item 
                Movie_item.innerHTML =` 
                    <h2>Movie Name:</h2><p>${item.name}</p> <br>
                    <h3>Priority:<br></h3> <p> ${item.priority}</p> <br> 
                    <h3>Notes: <br></h3><p> ${item.notes}</p> 
                    <button class="DeleteBtn" title="Delete" onclick="deleteWatchlistItem(${item.id},event)"><i class="fa-solid fa-trash"></i></button> 
                    <button class="EditBtn" title="Edit" onclick="editWatchlistItem(${item.id})"><i class="fa-solid fa-pen"></i></button> 
                `;
                movieList.appendChild(Movie_item);
            });

      
        })
        .catch(error => {
            console.error('Error fetching Watchlist items:', error);
        });
}


//Function to delete items from the watchlist 
function deleteWatchlistItem(id,event) {
    event.stopPropagation();  // prevents the form from going through the submission event when item is deleted
    event.preventDefault();
    if(confirm('Are you sure you want to delete this movie from watchlist?')) { //Displays a message which asks if user is sure they want to delete item.
        fetch(`http://localhost:3001/api/Watchlist-Items/${id}`, 
            {
            method:'DELETE',
        })
        
        .then(() => {
            console.log('Movie from watchlist deleted');   //Displays a message in console to confirm that the item was deleted sucessfully. 
            loadWatchlistItem();
        })
        .catch(error => {
            console.error('Error in deleting:', error); //Displays a message in console to confirm that the item was not able to be deleted and displays the error code in the console. 

        });
    }
}

//Function to edit items from the watchlist 
function editWatchlistItem(id) {
    fetch(`http://localhost:3001/api/Watchlist-Items/${id}` )
        .then(response => response.json())
        .then(data => {
            document.getElementById('Movie_Name').value = data.name;
            document.getElementById('Priority').value = data.priority;
            document.getElementById('Add_Note').value = data.notes;
            
            isEditMode=true;
            editID= id; 
            switchToEdit();
          
        })
        .catch(error => {
            console.error('Error in getting Movie:', error); //Displays a message in console to confirm that the item was not able to be edited and displays the error code in the console. 

        });
    

}

//Function to update items from the watchlist 
function updateWatchlistItem(event) {
    event.preventDefault();

    const name= document.getElementById('Movie_Name').value;
    const priority= document.getElementById('Priority').value;
    const notes= document.getElementById('Add_Note').value;



    if(isEditMode && editID !== null) {
        fetch(`http://localhost:3001/api/Watchlist-Items/${editID}`, {
            method:'PUT',
            headers: { 
                'Content-Type': 'application/json',
            },
            body:JSON.stringify({ name, priority, notes}),

        })
        .then(() => {
            console.log('Movie in watchlist was updated');
            loadWatchlistItem();
            switchToAdd();
        })
        .catch(error => {
            console.error('Error in changing the movie in watchlist:', error)
        });
    }
}

//Function to sort by priority 
function sortWatchlist() {
    event.preventDefault();

    fetch('http://localhost:3001/api/Watchlist-Items')
    .then(response => response.json())
    .then(data => {
        data.sort((a,b) => {
            const priorities = ["Low-Watch this year", "Medium-Watch in a couple of months", "High-Watch this week"];
            return priorities.indexOf(a.priority)-priorities.indexOf(b.priority);  
        });
        const movieList = document.getElementById('Movielist');
        movieList.innerHTML ='';
        data.forEach(item => {
            const Movie_item = document.createElement('div');
            Movie_item.className = 'Movie-item';
            Movie_item.innerHTML =` 
            <h2>Movie Name:</h2><p>${item.name}</p> <br>
            <h3>Priority:<br></h3> <p> ${item.priority}</p> <br> 
            <h3>Notes: <br></h3><p> ${item.notes}</p> 
            <button class="DeleteBtn" title="Delete" onclick="deleteWatchlistItem(${item.id},event)"><i class="fa-solid fa-trash"></i></button> 
            <button class="EditBtn" title="Edit" onclick="editWatchlistItem(${item.id})"><i class="fa-solid fa-pen"></i></button> 
        `;
        movieList.appendChild(Movie_item);

        });
    }) 
    .catch(error => {
        console.error('Error in getting watchlist items:', error);
    })

}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    loadWatchlistItem(); 
    document.getElementById('Form').onsubmit = addWatchlistItem; 

});


