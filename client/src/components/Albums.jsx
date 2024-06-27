import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/Albums.css';

const Albums = () => {
 
  const { userId } = useParams();
  const navigate = useNavigate();

  const [albums, setAlbums] = useState([]);
  const [filteredAlbums, setFilteredAlbums] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await fetch('http://localhost:3000/albums');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const userAlbums = data.filter(album => album.userId === Number(userId));
        setAlbums(userAlbums);
        setFilteredAlbums(userAlbums); // Initialize filteredAlbums with userAlbums
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbums();
  }, [userId]);

  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearchQuery(value);
    filterAlbums(value);
  };

  const filterAlbums = (query) => {
    const filtered = albums.filter((album) => {
      return album.title?.toLowerCase().includes(query.toLowerCase()) || album.id.toString().includes(query);
    });
    setFilteredAlbums(filtered);
  };

  const handleClick = (albumId) => {
    navigate(`/users/${userId}/albums/${albumId}`);
  };

  const handleAdd = async () => {
    let TITLEAlbum = prompt("Please enter the title of the Album:");
    if (TITLEAlbum === '') {
      // User clicked cancel or provided an empty value
      alert("Error! You must enter a value ❌");
      return;
    }
    if (TITLEAlbum != null) {
      try {
        const response = await fetch('http://localhost:3000/albums');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const allAlbums = await response.json();
        const newId = Math.max(...allAlbums.map(album => Number(album.id))) + 1; // Generate a new unique id

        const newAlbum = {
          userId: Number(userId),
          id: newId,
          title: TITLEAlbum
        };

        const postResponse = await fetch('http://localhost:3000/albums', {
          method: 'POST',
          body: JSON.stringify(newAlbum),
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
          },
        });

        if (!postResponse.ok) {
          throw new Error(`Network response was not ok: ${postResponse.statusText}`);
        }

        const data = await postResponse.json();
        const updatedAlbums = [...albums, data];
        setAlbums(updatedAlbums);
        setFilteredAlbums(updatedAlbums);
        alert('The Album has been added successfully! ☑️');
      } catch (error) {
        alert('There was a problem with adding the album: ' + error.message);
      }
    }
  }

  return (
    <div>
      <h2>User {userId}'s Albums</h2>
      <button onClick={handleAdd} id="addA-id">+ Add Album</button>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search albums..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>
      <div className="item-container">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          filteredAlbums.map((album, index) => (
            <div key={index} className="card" onClick={() => handleClick(album.id)}>
              <h3>{album.title}</h3>
              <p>Serial Number: {album.id}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Albums;
