import React, { useState, useEffect } from "react";
import './App.css';

function AlbumList() {
  const [albums, setAlbums] = useState([]);
  const [newAlbum, setNewAlbum] = useState({ title: "", artist: "", price: "" });
  const [albumId, setAlbumId] = useState("");
  const [singleAlbum, setSingleAlbum] = useState(null);

  useEffect(() => {
    fetch("/albums", { method: "GET" })
      .then((response) => response.json())
      .then((data) => setAlbums(data))
      .catch((error) => console.log("Fetch error:", error));
  }, []);

  // Handle form submission for adding a new album
  const handleAddAlbum = (e) => {
    e.preventDefault();
    fetch("http://backend:8080/albums", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: newAlbum.title,
        artist: newAlbum.artist,
        price: parseFloat(newAlbum.price)
      })
    })
      .then((response) => response.json())
      .then((album) => {
        setAlbums([...albums, album]); // Add new album to the list
        setNewAlbum({ title: "", artist: "", price: "" }); // Reset form fields
      })
      .catch((error) => console.log("Error adding album:", error));
  };

  // Handle fetching a single album by ID
  const handleGetAlbumById = (e) => {
    e.preventDefault();
    fetch(`http://backend:8080/albums/${albumId}`, { method: "GET" })
      .then((response) => response.json())
      .then((album) => setSingleAlbum(album))
      .catch((error) => console.log("Error fetching album:", error));
  };

  return (
    <div className="App">
      <h2>Album List:</h2>
      {albums.length > 0 ? (
        <ul className="album-list">
          {albums.map((album) => (
            <li key={album.id} className="album-item">
              <strong>{album.title}</strong> by {album.artist} - ${album.price}
            </li>
          ))}
        </ul>
      ) : (
        <p>No albums available.</p>
      )}

      <h2>Add a New Album</h2>
      <form onSubmit={handleAddAlbum} className="album-form">
        <input
          type="text"
          placeholder="Title"
          value={newAlbum.title}
          onChange={(e) => setNewAlbum({ ...newAlbum, title: e.target.value })}
          required
          className="album-input"
        />
        <input
          type="text"
          placeholder="Artist"
          value={newAlbum.artist}
          onChange={(e) => setNewAlbum({ ...newAlbum, artist: e.target.value })}
          required
          className="album-input"
        />
        <input
          type="number"
          placeholder="Price"
          value={newAlbum.price}
          onChange={(e) => setNewAlbum({ ...newAlbum, price: e.target.value })}
          required
          className="album-input"
        />
        <button type="submit" className="album-button">Add Album</button>
      </form>

      <h2>Get Album by ID</h2>
      <form onSubmit={handleGetAlbumById} className="album-form">
        <input
          type="text"
          placeholder="Album ID"
          value={albumId}
          onChange={(e) => setAlbumId(e.target.value)}
          className="album-input"
        />
        <button type="submit" className="album-button">Fetch Album</button>
      </form>

      {singleAlbum && (
        <div className="single-album">
          <h3>Album Details:</h3>
          <p>
            <strong>{singleAlbum.title}</strong> by {singleAlbum.artist} - $
            {singleAlbum.price}
          </p>
        </div>
      )}
    </div>
  );
}

export default AlbumList;


