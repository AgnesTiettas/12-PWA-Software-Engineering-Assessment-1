function addWatchlistItem(event) {
    event.preventDefault();

    const Name = document.getElementById('Movie_name').value;
    const notes= document.getElementById('Add_Note').value; 

    if (Name && notes) {
        fetch('http://localhost:3001/api/Watchlist-Items', {
            method:'POST',
            headers: { 
                'Content-Type': 'application/json', 
            },
            body:JSON.stringify({Name,notes}),
        })
        .then(response => response.json())
        .then(data => { 
            console.log('Added to watchlist:', data);
            loadWatchlistItem();
            form.reset();

        })
        .catch (error => { 
            console.error('Error:', error)
        })
    } else {
        alert('please fill in all required fields.')
    }
}

function loadWatchlistItem() {
    fetch('http://localhost:3001/api/Watchlist-Items')
        .then(response => response.json())
        .then(data => {
            list.innerHTML ='';
            data.forEach(item => {
                const Movie_item = document.createElement('div');
                Movie_item.className= 'Movie_item';
                Movie_item.dataset.id=item.id; 
                Movie_item.innerHTML =`
                    <h3>${item.Name}</h3>
                    <p>Notes: ${item.notes}</p>
                    <button class="delete-btn">Delete</button>
                `;
                list.appendChild(Movie_item);
            });
            const deleteButtons = document.querySelectorAll('.delete-btn');  
            deleteButtons.forEach(button => {
                button.addEventListener('click', deleteStudySession);
                });
        })
        .catch(error => {
            console.error('Error fetching study sessions:', error);
        });
}


function deleteStudySession(event){
    const Movie_item = event.target.parentElement;
    const Movie_ID = Movie_item.dataset.id;

    fetch(`http://localhost:3001/api/Watchlist-Items/${Movie_ID}`, {
        method:'DELETE',
    })

    .then(response=> {
        if(response.ok) {
            console.log('Deleted');
            Movie_item.remove();
        } else {
            console.error('Failed');

        }
    })
    .catch(error => { 
        console.error('Error:', error); 
    });
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    loadWatchlistItem(); 
    form.onsubmit = addWatchlistItem; 

});