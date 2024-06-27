import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/AlbumDetails.css';

const AlbumDetails = () => {
  const { id, userId } = useParams();
  const [photos, setPhotos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPhotos, setTotalPhotos] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const imagesPerPage = 10;

  const [showAddForm, setShowAddForm] = useState(false);

  const [addPhotoForm, setAddPhotoForm] = useState({
    title: '',
    thumbnailUrl: '',
    url: '',
  });

  const handleFormFieldInput = (e) => {
    const { name, value } = e.target;
    setAddPhotoForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  }

  const handleSubmitAddPhoto = async (e) => {
    e.preventDefault();

    // send data to api
    fetch('http://localhost:3000/photos', {
      method: 'POST',
      body: JSON.stringify(addPhotoForm),
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        setPhotos((prevPhotos) => [...prevPhotos, data]);
        alert("The image has been added successfully!☑️");
      })
      .catch((error) => {
        alert('There was a problem with adding the image: ' + error.message);
      });
    
    // reset form
    setAddPhotoForm(() => ({
      title: '',
      thumbnailUrl: '',
      url: '',
    }));
    setShowAddForm(() => false);
    // setAddPhotoForm(() => false);
  }

  useEffect(() => {
    const fetchTotalPhotos = async () => {
      try {
        const response = await fetch(`http://localhost:3000/photos?albumId=${id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const photosList = await response.json();
        setTotalPhotos(photosList.length);
      } catch (error) {
        console.error('Failed to fetch total photos:', error);
      }
    };

    fetchTotalPhotos();
  }, [id]);

  useEffect(() => {
    const fetchPhotos = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:3000/photos?albumId=${id}&_page=${currentPage}&_limit=${imagesPerPage}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (currentPage === 1) {
          setPhotos(data);
        } else {
          setPhotos((prevPhotos) => [...prevPhotos, ...data]);
        }
      } catch (error) {
        setError(error.message);
        console.error('Failed to fetch photos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, [id, currentPage]);

  const totalPages = Math.ceil(totalPhotos / imagesPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handleEdit = (photoId) => {
    let newUrl = prompt("Please enter the URL of the image:");
    if (newUrl === '') {
      alert("An empty value cannot be sent!");
      return;
    }

    if (newUrl != null) {
      let newThumbnailUrl = prompt("Please enter the ThumbnailUrl of the image:");
      if (newThumbnailUrl === '') {
        alert("An empty value cannot be sent!");
        return;
      }
      if (newThumbnailUrl != null) {
        let newTitle = prompt("Please enter the title of the image:");
        if (newTitle === '') {
          alert("An empty value cannot be sent!");
          return;
        }
        if (newTitle != null) {
          fetch(`http://localhost:3000/photos/${photoId}`, {
            method: 'PUT',
            body: JSON.stringify({ albumId: id, id: photoId, title: newTitle, url: newUrl, thumbnailUrl: newThumbnailUrl }),
            headers: {
              'Content-Type': 'application/json; charset=UTF-8',
            },
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
              }
              return response.json();
            })
            .then((updatedPhoto) => {
              setPhotos((prevPhotos) =>
                prevPhotos.map((photo) => (photo.id === updatedPhoto.id ? updatedPhoto : photo))
              );
              alert("The image has been successfully updated!☑️");
            })
            .catch((error) => {
              alert('There was a problem with updating the image: ' + error.message);
            });
        }
      }
    }
  };

  const handleDelete = (photoId) => {
    fetch(`http://localhost:3000/photos/${photoId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        return response.json();
      })
      .then(() => {
        setPhotos((prevPhotos) => prevPhotos.filter((photo) => photo.id !== photoId));
        alert("The image has been successfully deleted!☑️");
      })
      .catch((error) => {
        alert('There was a problem with deleting the image: ' + error.message);
      });
  };

  const handleBack = () => {
    navigate(`/users/${userId}/albums`);
  };

  const renderPhotos = () => {
    return photos.map((photo) => (
      <div key={photo.id} className="image-item">
        <div>
          <img src={photo.thumbnailUrl} alt={photo.title} className="carousel-image" />
          <p>{photo.title}</p>
        </div>
        <div>
          <button onClick={() => handleEdit(photo.id)} className="edit-button">
            ✏️
          </button>
          <button onClick={() => handleDelete(photo.id)} className="delete-button">
            🗑️
          </button>
        </div>
      </div>
    ));
  };

  return (
    <div>
      <h2>Album {id} Photos</h2>
      <button onClick={() => setShowAddForm(prev => !prev)} id="add-id">+ Add Photo</button>
      <form style={{
        display: showAddForm ? 'block' : 'none'
      }} onSubmit={handleSubmitAddPhoto}>
        <h3 className="">Add Photo</h3>

        {/* title */}
        <label className="">
          <span>Title</span>
          <input name='title' value={addPhotoForm.title} onChange={handleFormFieldInput} required type="text" placeholder="Title" />
        </label>

        {/* thumbnailUrl */}
        <label className="">
          <span>Thumbnail url</span>
          <input name='thumbnailUrl' value={addPhotoForm.thumbnailUrl} onChange={handleFormFieldInput} required type="url" placeholder='thumbnail' />
        </label>

        {/* url */}
        <label className="">
          <span>Url</span>
          <input name='url' value={addPhotoForm.url} onChange={handleFormFieldInput} required type="url" placeholder='url' />
        </label>
        
        <button>Add</button>
      </form>


      <button onClick={handleBack} id="back-id">Back to Albums</button>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <div className="image-grid">{renderPhotos()}</div>
      {currentPage < totalPages && (
        <button onClick={handleNextPage} className="load-more-button">
          Load More
        </button>
      )}
    </div>
  );
};

export default AlbumDetails;
