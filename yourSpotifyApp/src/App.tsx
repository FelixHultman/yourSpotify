import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import { Artist } from './interface';

function App() {
  const CLIENT_ID = '7538c85bb11846819cd8be3362a2135c';
  const REDIRECT_URI = 'http://localhost:5173';
  const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
  const RESPONSE_TYPE = 'token';

  const [token, setToken] = useState<string | null>(null);
  const [searchKey, setSearchKey] = useState<string>('');
  const [artists, setArtists] = useState<Artist[]>([]);

  useEffect(() => {
    const hash = window.location.hash;
    let newToken: string | null = null;

    if (hash) {
      const tokenParam = hash
        .substring(1)
        .split('&')
        .find((elem) => elem.startsWith('access_token'));

      if (tokenParam) {
        newToken = tokenParam.split('=')[1];
        window.location.hash = '';
        window.localStorage.setItem('token', newToken);
      }
    }

    const storedToken = window.localStorage.getItem('token');
    setToken(storedToken || newToken);
  }, []);

  const authUrl = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`;

  const logout = () => {
    setToken('');
    window.localStorage.removeItem('token');
  };

  const searchArtists = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const { data } = await axios.get('https://api.spotify.com/v1/search', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        q: searchKey,
        type: 'artist',
      },
    });

    setArtists(data.artists.items);

    console.log('artisters', artists);
  };

  const renderArtists = () => {
    return artists.map((artist) => (
      <div key={artist.id}>
        {artist.images.length > 0 ? (
          <img width={'100%'} src={artist.images[0].url} alt={artist.name} />
        ) : (
          <div>No Image</div>
        )}
        <div>{artist.name}</div>
      </div>
    ));
  };

  return (
    <div>
      <header>
        <h1>Your Spotify</h1>

        {!token ? (
          <a href={authUrl}>Log in to your Spotify account</a>
        ) : (
          <button onClick={logout}>Logout</button>
        )}

        {token ? (
          <form onSubmit={searchArtists}>
            <input
              className='border xl'
              type='text'
              onChange={(e) => setSearchKey(e.target.value)}
            />
            <button type='submit'>Search</button>
          </form>
        ) : (
          <h2>Please login</h2>
        )}

        {renderArtists()}
      </header>
    </div>
  );
}

export default App;
