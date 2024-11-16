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
}

