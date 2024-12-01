//Enables a Movie to added to the watchlist 
function addWatchlistItem(event) {
    event.preventDefault();

    const name = document.getElementById('Movie_Name').value; 
    const priority =document.getElementById('Priority').value;
    const notes= document.getElementById('Add_Note').value; 

    if (name && priority && notes) {
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
            document.getElementById('Form').reset();

        })
        .catch (error => { 
            console.error('Error:', error);
        });
    } else {
        alert('please fill in all required fields.');
    }
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
                    <button class="DeleteBtn" title="Delete" onclick="deleteWatchlistItem(${item.id})"><i class="fa-solid fa-trash"></i></button> 
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
function deleteWatchlistItem(id) {
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

function editWatchlistItem(id) {
    if(confirm('Are you sure?')) { 
        fetch( `http://localhost:3001/api/Watchlist-Items${id}`, 
            { 
                method:'E'
                
            }
        )
    }
}



// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    loadWatchlistItem(); 
    document.getElementById('Form').onsubmit = addWatchlistItem; 

});